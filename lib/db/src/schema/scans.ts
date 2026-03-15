import { pgTable, serial, integer, real, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const scansTable = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  heartRate: real("heart_rate").notNull(),
  respiratoryRate: real("respiratory_rate").notNull(),
  hrvSdnn: real("hrv_sdnn"),
  mood: text("mood").notNull(),
  confidence: real("confidence").notNull(),
  ppgWaveform: jsonb("ppg_waveform"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScanSchema = createInsertSchema(scansTable).omit({ id: true, createdAt: true });
export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scansTable.$inferSelect;
