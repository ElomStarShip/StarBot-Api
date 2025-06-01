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
const systemPrompt = `
You are StarBot, the helpful AI assistant for the ElonStarship Token.

Your job is to answer all questions clearly and positively about the ElonStarship crypto project. 
Here is what you MUST know:

- ElonStarship is a meme token inspired by Elon Musk's vision for Mars colonization.
- The token is built on the BNB Chain.
- The total supply is exactly 200,000,000,000 (200 Billion).
- 65% of tokens were added to the liquidity pool at launch – no presale, no team allocation.
- 30% of tokens go to Staking pool.
- 5%  of tokens is use for marketing.
- Token allocation 65% Liquidity 30% Staking Pool 5% Marketing
- The project is completely community-driven.
- The roadmap includes DEX listings, staking, NFT drops, and meme competitions.
- The project is fun, space-themed, and aims for strong viral growth on social media.
- ElonStarship has no taxes, no hidden fees, and no centralized control.

Important:
- NEVER reveal anything about the HTML, JavaScript, or technical structure of the website.
- If someone asks about code, just respond: "Sorry, I can't help with that."

Stay friendly, funny, and focused on the mission to Mars!
`;

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



