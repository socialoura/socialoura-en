import "server-only";

import { Pool } from "pg";
import {
  getDefaultPricing,
  normalizePricing,
  type PricingData,
} from "@/lib/pricing";

export type { PricingData };

const PRICING_ROW_ID = "pricing-data";

let memoryStore: PricingData | null = null;
let poolSingleton: Pool | null = null;

export function isDBConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!poolSingleton) {
    poolSingleton = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return poolSingleton;
}

export async function initDatabase(): Promise<void> {
  if (!isDBConfigured()) return;

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS pricing (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}

export async function getPricing(): Promise<PricingData | null> {
  if (!isDBConfigured()) {
    return memoryStore ? normalizePricing(memoryStore) : null;
  }

  await initDatabase();
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT data FROM pricing WHERE id = $1 LIMIT 1",
      [PRICING_ROW_ID]
    );
    if (res.rowCount === 0) return null;
    return normalizePricing(res.rows[0].data);
  } finally {
    client.release();
  }
}

export async function setPricing(data: PricingData): Promise<void> {
  if (!isDBConfigured()) {
    memoryStore = normalizePricing(data);
    return;
  }

  await initDatabase();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO pricing (id, data, updated_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (id)
      DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
      `,
      [PRICING_ROW_ID, JSON.stringify(data)]
    );
  } finally {
    client.release();
  }
}
