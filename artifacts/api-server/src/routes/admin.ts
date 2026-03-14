import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { eq, ilike, or, count, and, gte, sql } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { db, ordersTable, combosTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminOrdersResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
  GetAnalyticsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "al-mehandi-secret-2024";
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const qrStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `qr-${Date.now()}${ext}`);
  },
});
const qrUpload = multer({ storage: qrStorage });

function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  if (parsed.data.username !== ADMIN_USERNAME || parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "24h" });
  res.json(AdminLoginResponse.parse({ success: true, token }));
});

router.get("/admin/orders", authMiddleware, async (req, res): Promise<void> => {
  const { search, status } = req.query as { search?: string; status?: string };

  let query = db.select().from(ordersTable).$dynamic();

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        ilike(ordersTable.fullName, `%${search}%`),
        ilike(ordersTable.phone, `%${search}%`),
        ilike(ordersTable.whatsapp, `%${search}%`)
      )
    );
  }
  if (status && status !== "all") {
    conditions.push(eq(ordersTable.status, status));
  }

  if (conditions.length > 0) {
    query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
  }

  const orders = await query.orderBy(sql`${ordersTable.createdAt} DESC`);
  res.json(GetAdminOrdersResponse.parse(orders));
});

router.patch("/admin/orders/:id/status", authMiddleware, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderStatusParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }

  const body = UpdateOrderStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: body.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse(order));
});

router.get("/admin/analytics", authMiddleware, async (req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [total] = await db.select({ count: count() }).from(ordersTable);
  const [todayCount] = await db
    .select({ count: count() })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, today));
  const [pending] = await db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, "pending_verification"));
  const [confirmed] = await db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, "order_confirmed"));
  const [cancelled] = await db
    .select({ count: count() })
    .from(ordersTable)
    .where(eq(ordersTable.status, "cancelled"));

  res.json(
    GetAnalyticsResponse.parse({
      totalOrders: Number(total?.count ?? 0),
      todayOrders: Number(todayCount?.count ?? 0),
      pendingOrders: Number(pending?.count ?? 0),
      confirmedOrders: Number(confirmed?.count ?? 0),
      cancelledOrders: Number(cancelled?.count ?? 0),
    })
  );
});

router.put(
  "/admin/combos/:id/qr",
  authMiddleware,
  qrUpload.single("qr"),
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const qrCodeUrl = `/api/uploads/${req.file.filename}`;

    const [combo] = await db
      .update(combosTable)
      .set({ qrCodeUrl })
      .where(eq(combosTable.id, id))
      .returning();

    if (!combo) {
      res.status(404).json({ error: "Combo not found" });
      return;
    }

    res.json({ qrCodeUrl });
  }
);

export default router;
