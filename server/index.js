const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dir = './uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage });

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
const SECRET_KEY = "Nathnael"; // Key used to sign tokens

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Hash password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword,
      },
    });
    res.json({ message: "User registered!", user: newUser.username });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // Generate JWT session token valid for 24 hours
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    const { title, description, price, category, seller } = req.body;
    const imageUrl = req.file ? req.file.filename : null;

    // Convert price to float, as FormData sends strings
    const newPrice = parseFloat(price) || 0;

    const newItem = await prisma.item.create({
      data: {
        title: title || "Untitled",
        description: description || "",
        price: newPrice,
        category: category || "General",
        seller: seller || "Anonymous",
        imageUrl,
      },
    });
    res.json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create item" });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.item.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

app.put('/api/items/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category } = req.body;
    
    // Check if item exists
    const existingItem = await prisma.item.findUnique({ where: { id: parseInt(id) }});
    if (!existingItem) return res.status(404).json({ error: "Item not found" });

    const newPrice = parseFloat(price);
    const updateData = {
      title: title || existingItem.title,
      description: description !== undefined ? description : existingItem.description,
      price: isNaN(newPrice) ? existingItem.price : newPrice,
      category: category || existingItem.category,
    };

    if (req.file) {
      updateData.imageUrl = req.file.filename;
      // Optionally delete the old image file
      if (existingItem.imageUrl) {
        const oldPath = path.join(__dirname, 'uploads', existingItem.imageUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    const updatedItem = await prisma.item.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
    
    res.json(updatedItem);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

app.get('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) }
    });
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { buyerUsername, items } = req.body;
    let total = 0;
    
    // Calculate total and prepare items data
    const orderItemsData = items.map(item => {
      total += item.price * (item.quantity || 1);
      return {
        itemId: item.id,
        itemTitle: item.title,
        quantity: item.quantity || 1,
        priceAtPurchase: item.price
      };
    });

    const newOrder = await prisma.order.create({
      data: {
        buyerUsername,
        total,
        items: {
          create: orderItemsData
        }
      },
      include: {
        items: true
      }
    });
    
    res.json(newOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get('/api/orders/:buyer', async (req, res) => {
  try {
    const { buyer } = req.params;
    const orders = await prisma.order.findMany({
      where: { buyerUsername: buyer },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});