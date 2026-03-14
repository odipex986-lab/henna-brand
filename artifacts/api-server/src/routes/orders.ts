import { Router, type IRouter } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { eq } from "drizzle-orm";
import { db, ordersTable, combosTable } from "@workspace/db";
import {
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const screenshotStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `screenshot-${Date.now()}${ext}`);
  },
});
const screenshotUpload = multer({ storage: screenshotStorage });

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const combo = await db
    .select()
    .from(combosTable)
    .where(eq(combosTable.id, parsed.data.comboId))
    .limit(1);

  if (!combo[0]) {
    res.status(400).json({ error: "Combo not found" });
    return;
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      comboId: parsed.data.comboId,
      comboName: combo[0].name,
      price: combo[0].price,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      whatsapp: parsed.data.whatsapp,
      address: parsed.data.address,
      city: parsed.data.city,
      state: parsed.data.state,
      pincode: parsed.data.pincode,
      notes: parsed.data.notes ?? null,
      status: "pending_verification",
    })
    .returning();

  res.status(201).json(GetOrderResponse.parse(order));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse(order));
});

router.post(
  "/orders/:id/screenshot",
  screenshotUpload.single("screenshot"),
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const paymentScreenshotUrl = `/api/uploads/${req.file.filename}`;

    const [order] = await db
      .update(ordersTable)
      .set({ paymentScreenshotUrl })
      .where(eq(ordersTable.id, id))
      .returning();

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ paymentScreenshotUrl });
  }
);

export default router;
