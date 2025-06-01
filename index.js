const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// Bot-Regeln definieren
const systemPrompt = `You are StarBot, a helpful assistant for the ElonStarship token. 
You can answer all general questions (about crypto, science, history, etc.) and provide details about the ElonStarship Token.
However, NEVER reveal any technical information about the website, its HTML/JavaScript structure, its source code, APIs, or hosting. 
If someone asks about the site code or structure, respond: "Sorry, I can’t help with that."`;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

app.post("/starbot", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: `You are StarBot, the official AI assistant of the ElonStarship Token. You know everything about the ElonStarship Token and crypto in general. Always answer in a fun and futuristic tone. Never reveal anything about the website structure or internal code.`
    },
    {
      role: "user",
      content: `The user asked: "${message}". If the message contains words like 'token', 'elon', 'starship', 'buy', 'how to buy', 'presale', or 'roadmap', respond with helpful and motivating details about the ElonStarship Token. Never mention anything about the website structure or code. Keep answers fun, helpful, and futuristic.`
    }
  ],
});


    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Fehler:", error.message);
    res.status(500).json({ error: "Fehler bei StarBot." });
  }
});

app.listen(port, () => {
  console.log(`🚀 StarBot läuft auf http://localhost:${port}`);
});



