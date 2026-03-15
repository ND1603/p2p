const express = require('express');
const app = express();
const PORT = 5000; // The server will use Door 5000

app.get('/', (req, res) => {
  res.send('The Campus Marketplace Server is alive!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});