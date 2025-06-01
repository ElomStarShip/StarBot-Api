const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();

// ✅ CORS korrekt konfigurieren
app.use(cors({ origin: "*" }));

app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const systemPrompt = `You are StarBot, a helpful assistant for the ElonStarship token.
You can answer all general questions about crypto, science, history, and the ElonStarship token.
NEVER reveal technical info about the website or its HTML. If asked, respond: "Sorry, I can't help with that."`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// GET für Browsercheck
app.get("/", (req, res) => {
  res.send("✅ StarBot API is online");
});

// Methode absichern
app.get("/starbot", (req, res) => {
  res.status(405).send("❌ Please use POST to communicate with StarBot.");
});

// 🧠 POST: Bot-Antwort
app.post("/starbot", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `The user asked: "${message}".`,
        },
      ],
    });

    res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("Fehler:", error.message);
    res.status(500).json({ error: "Fehler bei StarBot 🤖" });
  }
});

app.listen(port, () => {
  console.log(`🚀 StarBot läuft auf http://localhost:${port}`);
});



