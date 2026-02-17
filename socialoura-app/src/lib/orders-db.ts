import "server-only";

import { Pool } from "pg";
import { Order } from "@/types/admin";

// ─── In-memory fallback (empty — no fake data) ───
let memoryOrders: Order[] = [];

let poolSingleton: Pool | null = null;

function isDBConfigured(): boolean {
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

async function initOrdersTable(): Promise<void> {
  if (!isDBConfigured()) return;

  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL DEFAULT '',
        email TEXT NOT NULL DEFAULT '',
        platform TEXT NOT NULL DEFAULT '',
        type TEXT NOT NULL DEFAULT '',
        quantity INT NOT NULL DEFAULT 0,
        price DOUBLE PRECISION NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        order_status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT DEFAULT '',
        country TEXT DEFAULT 'US'
      );
    `);
  } finally {
    client.release();
  }
}

// ─── Public API ───

export async function getAllOrders(): Promise<Order[]> {
  if (!isDBConfigured()) {
    return [...memoryOrders];
  }

  await initOrdersTable();
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return res.rows.map(rowToOrder);
  } finally {
    client.release();
  }
}

export async function createOrder(order: Order): Promise<Order> {
  if (!isDBConfigured()) {
    memoryOrders.unshift(order);
    return order;
  }

  await initOrdersTable();
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO orders (id, username, email, platform, type, quantity, price, created_at, order_status, notes, country)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        order.id,
        order.username,
        order.email,
        order.platform,
        order.type,
        order.quantity,
        order.price,
        order.created_at,
        order.order_status,
        order.notes || "",
        order.country || "US",
      ]
    );
    return order;
  } finally {
    client.release();
  }
}

export async function updateOrder(
  id: string,
  updates: Partial<Order>
): Promise<Order | null> {
  if (!isDBConfigured()) {
    const idx = memoryOrders.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    memoryOrders[idx] = { ...memoryOrders[idx], ...updates };
    return memoryOrders[idx];
  }

  await initOrdersTable();
  const pool = getPool();
  const client = await pool.connect();
  try {
    // Build dynamic SET clause from updates
    const fields: string[] = [];
    const values: any[] = [];
    let paramIdx = 1;

    const allowedFields = [
      "order_status",
      "notes",
      "username",
      "email",
      "country",
    ];
    for (const key of allowedFields) {
      if (key in updates) {
        fields.push(`${key} = $${paramIdx}`);
        values.push((updates as any)[key]);
        paramIdx++;
      }
    }

    if (fields.length === 0) return null;

    values.push(id);
    const res = await client.query(
      `UPDATE orders SET ${fields.join(", ")} WHERE id = $${paramIdx} RETURNING *`,
      values
    );

    if (res.rowCount === 0) return null;
    return rowToOrder(res.rows[0]);
  } finally {
    client.release();
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!isDBConfigured()) {
    const idx = memoryOrders.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    memoryOrders.splice(idx, 1);
    return true;
  }

  await initOrdersTable();
  const pool = getPool();
  const client = await pool.connect();
  try {
    const res = await client.query("DELETE FROM orders WHERE id = $1", [id]);
    return (res.rowCount ?? 0) > 0;
  } finally {
    client.release();
  }
}

// ─── Helpers ───

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    platform: row.platform,
    type: row.type,
    quantity: Number(row.quantity),
    price: Number(row.price),
    created_at: row.created_at
      ? new Date(row.created_at).toISOString()
      : new Date().toISOString(),
    order_status: row.order_status || "pending",
    notes: row.notes || "",
    country: row.country || "US",
  };
}
