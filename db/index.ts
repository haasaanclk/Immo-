import "server-only";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, and, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "./schema";
import { properties as seedProperties } from "@/data/properties";

/**
 * libSQL data layer — one driver for both worlds:
 *   - Local dev:   DATABASE_URL=file:domaine.db   (default)
 *   - Production:  DATABASE_URL=libsql://<db>.turso.io + DATABASE_AUTH_TOKEN  (Vercel-ready)
 * The SQLite schema is unchanged; Turso is SQLite-compatible.
 */
const url = process.env.DATABASE_URL || "file:domaine.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient(authToken ? { url, authToken } : { url });
export const db = drizzle(client, { schema });

// One-time schema + seed, memoized across invocations.
const g = globalThis as unknown as { __domaineReady?: Promise<void> };

function ensureReady(): Promise<void> {
  if (!g.__domaineReady) g.__domaineReady = init();
  return g.__domaineReady;
}

async function init() {
  await client.executeMultiple(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'resident',
      lifestyle_profile TEXT,
      created_at INTEGER NOT NULL
    );
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      district TEXT NOT NULL,
      city TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'Residence',
      year INTEGER NOT NULL DEFAULT 2020,
      match INTEGER NOT NULL,
      prestige_score INTEGER NOT NULL,
      off_market INTEGER NOT NULL,
      privacy_level REAL NOT NULL,
      silence_day INTEGER NOT NULL,
      silence_night INTEGER NOT NULL,
      hue INTEGER NOT NULL,
      reasons TEXT NOT NULL,
      dna TEXT NOT NULL,
      checkup TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS saved_properties (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      property_id TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);

  // Migrations for pre-existing DBs missing newer columns.
  const userCols = await client.execute("PRAGMA table_info(users)");
  if (!userCols.rows.some((r) => (r as unknown as { name: string }).name === "lifestyle_profile")) {
    await client.execute("ALTER TABLE users ADD COLUMN lifestyle_profile TEXT");
  }
  const propCols = await client.execute("PRAGMA table_info(properties)");
  const propNames = propCols.rows.map((r) => (r as unknown as { name: string }).name);
  if (!propNames.includes("kind")) {
    await client.execute("ALTER TABLE properties ADD COLUMN kind TEXT NOT NULL DEFAULT 'Residence'");
  }
  if (!propNames.includes("year")) {
    await client.execute("ALTER TABLE properties ADD COLUMN year INTEGER NOT NULL DEFAULT 2020");
  }

  // Seed the catalog once.
  const count = await client.execute("SELECT COUNT(*) AS n FROM properties");
  if (Number((count.rows[0] as unknown as { n: number }).n) === 0) {
    await db.insert(schema.properties).values(
      seedProperties.map((p) => ({
        id: p.id,
        name: p.name,
        district: p.district,
        city: p.city,
        kind: p.kind,
        year: p.year,
        match: p.match,
        prestigeScore: p.prestigeScore,
        offMarket: p.offMarket,
        privacyLevel: p.privacyLevel,
        silenceDay: p.silence.day,
        silenceNight: p.silence.night,
        hue: p.hue,
        reasons: p.reasons,
        dna: p.dna as unknown as Record<string, number | string>,
        checkup: p.checkup,
      })),
    );
  }
}

// ---- Data access ----

export async function getAllProperties() {
  await ensureReady();
  return db.select().from(schema.properties);
}

export async function getPropertyById(id: string) {
  await ensureReady();
  const rows = await db.select().from(schema.properties).where(eq(schema.properties.id, id));
  return rows[0] ?? null;
}

export async function getUserByEmail(email: string) {
  await ensureReady();
  const rows = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  await ensureReady();
  const rows = await db.select().from(schema.users).where(eq(schema.users.id, id));
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string, name: string) {
  await ensureReady();
  const id = randomUUID();
  await db
    .insert(schema.users)
    .values({ id, email: email.toLowerCase(), passwordHash, name, tier: "resident", createdAt: Date.now() });
  return getUserById(id);
}

export async function setUserTier(userId: string, tier: string) {
  await ensureReady();
  await db.update(schema.users).set({ tier }).where(eq(schema.users.id, userId));
}

export async function saveLifestyleProfile(
  userId: string,
  profile: import("./schema").LifestyleProfile,
) {
  await ensureReady();
  await db.update(schema.users).set({ lifestyleProfile: profile }).where(eq(schema.users.id, userId));
}

// ---- Saved properties (favorites) ----

export async function getSavedPropertyIds(userId: string): Promise<string[]> {
  await ensureReady();
  const rows = await db
    .select({ propertyId: schema.savedProperties.propertyId })
    .from(schema.savedProperties)
    .where(eq(schema.savedProperties.userId, userId));
  return rows.map((r) => r.propertyId);
}

export async function getSavedProperties(userId: string) {
  await ensureReady();
  const ids = await getSavedPropertyIds(userId);
  if (ids.length === 0) return [];
  return db.select().from(schema.properties).where(inArray(schema.properties.id, ids));
}

export async function isSaved(userId: string, propertyId: string): Promise<boolean> {
  await ensureReady();
  const rows = await db
    .select({ id: schema.savedProperties.id })
    .from(schema.savedProperties)
    .where(
      and(
        eq(schema.savedProperties.userId, userId),
        eq(schema.savedProperties.propertyId, propertyId),
      ),
    );
  return rows.length > 0;
}

export async function saveProperty(userId: string, propertyId: string) {
  await ensureReady();
  if (await isSaved(userId, propertyId)) return;
  await db.insert(schema.savedProperties).values({
    id: randomUUID(),
    userId,
    propertyId,
    createdAt: Date.now(),
  });
}

export async function unsaveProperty(userId: string, propertyId: string) {
  await ensureReady();
  await db
    .delete(schema.savedProperties)
    .where(
      and(
        eq(schema.savedProperties.userId, userId),
        eq(schema.savedProperties.propertyId, propertyId),
      ),
    );
}
