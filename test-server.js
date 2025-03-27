const express = require("express");
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello! Server is working!");
});

app.listen(PORT, () => {
  console.log(`
=============================
    SERVER TEST
=============================
→ Server is running
→ Open: http://localhost:${PORT}
→ Press Ctrl+C to stop server
=============================
    `);
});
