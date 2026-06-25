import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import path from "path";
import { randomUUID } from "crypto";
import * as schema from "./schema";
import { properties as seedProperties } from "@/data/properties";

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), "domaine.db");

// Singleton across hot reloads / route invocations.
const g = globalThis as unknown as { __domaineDb?: ReturnType<typeof create> };

function create() {
  const sqlite = new Database(DB_PATH);
  sqlite.pragma("journal_mode = WAL");

  sqlite.exec(`
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

  // Lightweight migration for pre-existing DBs missing the profile column.
  const cols = sqlite.prepare("PRAGMA table_info(users)").all() as { name: string }[];
  if (!cols.some((c) => c.name === "lifestyle_profile")) {
    sqlite.exec("ALTER TABLE users ADD COLUMN lifestyle_profile TEXT");
  }

  const db = drizzle(sqlite, { schema });

  // Seed the catalog once.
  const count = sqlite.prepare("SELECT COUNT(*) AS n FROM properties").get() as { n: number };
  if (count.n === 0) {
    const insert = db.insert(schema.properties).values(
      seedProperties.map((p) => ({
        id: p.id,
        name: p.name,
        district: p.district,
        city: p.city,
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
    insert.run();
  }

  return db;
}

export const db = g.__domaineDb ?? (g.__domaineDb = create());

// ---- Data access ----

export async function getAllProperties() {
  return db.select().from(schema.properties).all();
}

export async function getPropertyById(id: string) {
  const rows = db.select().from(schema.properties).where(eq(schema.properties.id, id)).all();
  return rows[0] ?? null;
}

export async function getUserByEmail(email: string) {
  const rows = db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase())).all();
  return rows[0] ?? null;
}

export async function getUserById(id: string) {
  const rows = db.select().from(schema.users).where(eq(schema.users.id, id)).all();
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string, name: string) {
  const id = randomUUID();
  db.insert(schema.users)
    .values({ id, email: email.toLowerCase(), passwordHash, name, tier: "resident", createdAt: Date.now() })
    .run();
  return getUserById(id);
}

export async function setUserTier(userId: string, tier: string) {
  db.update(schema.users).set({ tier }).where(eq(schema.users.id, userId)).run();
}

export async function saveLifestyleProfile(
  userId: string,
  profile: import("./schema").LifestyleProfile,
) {
  db.update(schema.users).set({ lifestyleProfile: profile }).where(eq(schema.users.id, userId)).run();
}
