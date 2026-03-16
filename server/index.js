const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json()); // This lets your server read JSON data

// 1. GET Route: Fetch all items for the marketplace
app.get('/api/items', async (req, res) => {
  const items = await prisma.item.findMany();
  res.json(items);
});

// 2. POST Route: Add a new item to the marketplace
app.post('/api/items', async (req, res) => {
  const { title, description, price, category } = req.body;
  try {
    const newItem = await prisma.item.create({
      data: { title, description, price, category },
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: "Could not create item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});