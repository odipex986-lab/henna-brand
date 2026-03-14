import { Router, type IRouter } from "express";
import { db, combosTable } from "@workspace/db";
import { GetCombosResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/combos", async (_req, res): Promise<void> => {
  const combos = await db.select().from(combosTable).orderBy(combosTable.id);
  res.json(GetCombosResponse.parse(combos));
});

export default router;
