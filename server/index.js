const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 1. GET ALL ITEMS (This was missing!)
app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// 2. GET ONE ITEM (For the Detail Page)
app.get('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) }
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
});

// 3. POST NEW ITEM (Updated with Seller)
app.post('/api/items', async (req, res) => {
  try {
    const { title, description, price, category, seller } = req.body;
    
    const newItem = await prisma.item.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price) || 0,
        category: category,
        seller: seller || "Anonymous" // Now saves the seller name!
      }
    });
    res.json(newItem);
  } catch (error) {
    console.error("PRISMA ERROR:", error); 
    res.status(400).json({ error: "Could not create item", details: error.message });
  }
});

// 4. DELETE AN ITEM
app.delete('/api/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.item.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});