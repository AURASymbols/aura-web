let pool = null;
let pg = null;

function isConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

async function getPool() {
  if (!isConfigured()) return null;
  if (!pg) pg = require("pg");
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

async function getDatabaseStatus() {
  if (!isConfigured()) {
    return { configured: false, status: "not configured" };
  }

  try {
    const db = await getPool();
    await db.query("SELECT 1");
    return { configured: true, status: "connected" };
  } catch (error) {
    return { configured: true, status: "unavailable", error: error.message };
  }
}

async function closeDatabase() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { getDatabaseStatus, closeDatabase };
