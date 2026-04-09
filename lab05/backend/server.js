const express = require("express");
const cors = require("cors");
const os = require("os");
const crypto = require("crypto");
const { pool, initDb } = require('./db');

const app = express();
const port = process.env.PORT || 3000;
const instanceId = process.env.INSTANCE_ID || os.hostname();

const startTime = Date.now();
let requestCount = 0;

app.use(cors());
app.use(express.json());

// Middleware to track request count
app.use((req, res, next) => {
  requestCount++;
  next();
});

// Initialize Database connection and table
initDb();

let nextId = 3;

// GET /health - Retrieve backend health
app.get("/health", (req, res) => {
  const uptime = (Date.now() - startTime) / 1000;
  res.json({
    status: "ok",
    uptime,
  });
});

// GET /items - Retrieve all items
app.get("/items", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /items - Add a new item
app.post("/items", async (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  try {
    const result = await pool.query(
      'INSERT INTO items (name, price) VALUES ($1, $2) RETURNING *',
      [name, Number(price)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /stats - Retrieve statistics
app.get("/stats", async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM items');
    const totalItems = parseInt(result.rows[0].count);
    const uptime = (Date.now() - startTime) / 1000;
    
    res.json({
      totalItems,
      instanceId,
      serverTime: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      uptime,
      requests: requestCount,
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Backend server (Instance ID: ${instanceId}) listening on port ${port}`);
  });
}
module.exports = app;
