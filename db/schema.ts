import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Drizzle schema (SQLite for local dev). Postgres-portable: swap the imports to
 * `drizzle-orm/pg-core` (pgTable / varchar / boolean / jsonb) and the driver in
 * db/index.ts to migrate to Postgres — the table/column shape is unchanged.
 */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  tier: text("tier").notNull().default("resident"), // resident | prive | cercle_noir
  // The user's lifestyle DNA, produced by the AI concierge — the memory that
  // personalizes every Intelligence report.
  lifestyleProfile: text("lifestyle_profile", { mode: "json" }).$type<LifestyleProfile | null>(),
  createdAt: integer("created_at").notNull(),
});

export interface LifestyleProfile {
  tier: string;
  traits: { label: string; value: number }[];
  priorities: string[];
  matches?: { id: string; match: number; reasons: string[] }[];
}

export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  district: text("district").notNull(),
  city: text("city").notNull(),
  kind: text("kind").notNull().default("Residence"),
  year: integer("year").notNull().default(2020),
  price: integer("price").notNull().default(0),
  match: integer("match").notNull(),
  prestigeScore: integer("prestige_score").notNull(),
  offMarket: integer("off_market", { mode: "boolean" }).notNull(),
  privacyLevel: real("privacy_level").notNull(),
  silenceDay: integer("silence_day").notNull(),
  silenceNight: integer("silence_night").notNull(),
  hue: integer("hue").notNull(),
  reasons: text("reasons", { mode: "json" }).notNull().$type<string[]>(),
  dna: text("dna", { mode: "json" }).notNull().$type<Record<string, number | string>>(),
  checkup: text("checkup", { mode: "json" }).notNull().$type<Record<string, string>>(),
});

export const viewings = sqliteTable("viewings", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  propertyId: text("property_id").notNull(),
  type: text("type").notNull(), // "viewing" (özel gösterim) | "interest" (invisible buyer)
  preferredDate: text("preferred_date"),
  qualification: text("qualification"), // masked proof-of-funds band
  anonymous: integer("anonymous", { mode: "boolean" }).notNull().default(true),
  note: text("note"),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at").notNull(),
});

export const savedProperties = sqliteTable("saved_properties", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  propertyId: text("property_id").notNull(),
  createdAt: integer("created_at").notNull(),
});

export type UserRow = typeof users.$inferSelect;
export type PropertyRow = typeof properties.$inferSelect;
