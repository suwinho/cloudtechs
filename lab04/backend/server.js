const express = require("express");
const cors = require("cors");
const os = require("os");
const crypto = require("crypto");

const app = express();
const port = process.env.PORT || 3000;
const instanceId = process.env.INSTANCE_ID || os.hostname();

app.use(cors());
app.use(express.json());

// In-memory array of items
let items = [
  { id: 1, name: "Sample Product 1", price: 19.99 },
  { id: 2, name: "Sample Product 2", price: 29.99 },
];

let nextId = 3;

// GET /items - Retrieve all items
app.get("/items", (req, res) => {
  res.json(items);
});

// POST /items - Add a new item
app.post("/items", (req, res) => {
  const { name, price } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Name and price are required" });
  }

  const newItem = {
    id: nextId++,
    name,
    price: Number(price),
  };

  items.push(newItem);
  res.status(201).json(newItem);
});

// GET /stats - Retrieve statistics
app.get("/stats", (req, res) => {
  res.json({
    totalItems: items.length,
    instanceId: instanceId,
    generatedAt: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(
    `Backend server (Instance ID: ${instanceId}) listening on port ${port}`,
  );
});
