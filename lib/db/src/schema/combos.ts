import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const combosTable = pgTable("combos", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  hennaCount: integer("henna_count").notNull(),
  nailCount: integer("nail_count").notNull(),
  qrCodeUrl: text("qr_code_url"),
});

export const insertComboSchema = createInsertSchema(combosTable).omit({ id: true });
export type InsertCombo = z.infer<typeof insertComboSchema>;
export type Combo = typeof combosTable.$inferSelect;
