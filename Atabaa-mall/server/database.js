const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'atabaa.db');
let db = null;

async function getDb() {
  if (db) return db;
  const SQL = await initSqlJs();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run('PRAGMA foreign_keys = ON');
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

async function initDb() {
  const db = await getDb();
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT,
      color TEXT,
      count INTEGER DEFAULT 0,
      image TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT,
      category_id TEXT,
      name TEXT NOT NULL,
      area TEXT,
      shops INTEGER DEFAULT 0,
      PRIMARY KEY (id, category_id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS merchants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      stall TEXT,
      phone TEXT UNIQUE,
      section TEXT,
      rating REAL DEFAULT 0,
      verified INTEGER DEFAULT 0,
      joined TEXT,
      image TEXT,
      password TEXT DEFAULT '123456',
      email TEXT,
      status TEXT DEFAULT 'نشط',
      owner TEXT,
      products_count INTEGER DEFAULT 0,
      revenue REAL DEFAULT 0
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      description TEXT,
      shop_name TEXT,
      stall TEXT,
      phone TEXT,
      category TEXT,
      sub_category TEXT,
      colors TEXT DEFAULT '[]',
      sizes TEXT DEFAULT '[]',
      images TEXT DEFAULT '[]',
      rating REAL DEFAULT 0,
      sales INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      discount INTEGER DEFAULT 0,
      whatsapp TEXT,
      merchant_id INTEGER,
      created_at TEXT DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (merchant_id) REFERENCES merchants(id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT UNIQUE,
      customer_name TEXT,
      customer_phone TEXT,
      items TEXT DEFAULT '[]',
      total REAL,
      status TEXT DEFAULT 'قيد المراجعة',
      payment TEXT DEFAULT 'غير مدفوع',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      merchant_id INTEGER,
      role TEXT DEFAULT 'merchant',
      created_at TEXT DEFAULT (datetime('now','localtime'))
    )
  `);
  saveDb();
  return db;
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function get(sql, params = []) {
  const rows = all(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
  return { changes: db.getRowsModified(), lastInsertRowid: db.exec("SELECT last_insert_rowid() as id")[0]?.values[0][0] };
}

module.exports = { initDb, getDb, saveDb, all, get, run };
