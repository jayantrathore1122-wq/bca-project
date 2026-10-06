// A tiny file-based "database". Instead of MongoDB, all data lives in
// data/db.json and is loaded into memory on startup. Every write calls
// save() to persist it back to disk. This is intentionally simple and
// is meant for learning/demo purposes, not production concurrency.

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "db.json");

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = { users: [], posts: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(raw);
}

const db = load();

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

module.exports = { db, save };
