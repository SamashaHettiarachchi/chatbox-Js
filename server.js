const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

dotenv.config();
const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔹 Get the correct model name from Step 1
const MODEL_NAME = "gemini-1.5-pro"; // ✅ Change this if needed
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

app.post("/chat", async (req, res) => {
  if (!API_KEY)
    return res.status(500).json({ error: "Missing Gemini API Key" });

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: req.body.message }] }],
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.candidates) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    res.json({ response: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
