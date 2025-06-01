const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const corsOptions = {
  origin: "https://elomstarship.github.io",
  methods: ["POST"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

// Bot-Regeln
const systemPrompt = `You are StarBot, a helpful assistant for the ElonStarship token.
You can answer general questions about crypto, ElonStarship, science, memes, etc.
NEVER explain or reveal anything about the website's structure or source code.
If someone asks about the HTML/JS, always respond with: "Sorry, I can't help with that."`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



// Test-Route im Browser
app.get("/", (req, res) => {
  res.send("✅ StarBot API is online");
});

// Nur POST erlaubt
app.get("/starbot", (req, res) => {
  res.status(405).send("❌ Please use POST to communicate with StarBot.");
});

// Die Bot-Funktion
app.post("/starbot", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Fehler bei OpenAI:", error);
    res.status(500).json({ error: "Serverfehler beim Antworten" });
  }
});

app.listen(port, () => {
  console.log(`🚀 StarBot läuft auf http://localhost:${port}`);
});



