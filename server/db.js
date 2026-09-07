const fs = require("fs");
const path = require("path");

let pool = null;
let pg = null;

function isConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

async function getDatabase() {
  if (!isConfigured()) return null;
  if (!pg) pg = require("pg");
  if (!pool) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  }
  return pool;
}

async function initializeDatabase() {
  if (!isConfigured()) return { configured: false, status: "not configured" };

  const db = await getDatabase();
  const schemaPath = path.join(__dirname, "..", "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await db.query(schema);

  return { configured: true, status: "initialized" };
}

async function getDatabaseStatus() {
  if (!isConfigured()) {
    return { configured: false, status: "not configured" };
  }

  try {
    const db = await getDatabase();
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

module.exports = {
  getDatabase,
  getDatabaseStatus,
  initializeDatabase,
  isDatabaseConfigured: isConfigured,
  closeDatabase
};
