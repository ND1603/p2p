const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

// bcrypt hides passwords, jwt creates the login 'session' token
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// --------------------------------

const app = express();
const prisma = new PrismaClient();
const PORT = 5000;
const SECRET_KEY = "Nathnael"; // Key used to sign tokens

app.use(cors());
app.use(express.json());

//  REGISTER ROUTE (Sign Up) ---
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // We 'hash' the password so even we can't read it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: hashedPassword, // Store the scrambled version
      },
    });
    res.json({ message: "User registered!", user: newUser.username });
  } catch (error) {
    res.status(400).json({ error: "Username already exists" });
  }
});

//  LOGIN ROUTE (Sign In) ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 1. Try to find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(400).json({ error: "User not found" });

    // 2. Check if the password they typed matches the 'scramble' in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // 3. Create a 'wristband' (Token) so the browser remembers them
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
    
    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ... Your existing GET, POST items, and DELETE routes 

app.get('/api/items', async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// (Keep the rest of your routes exactly as they were!)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});