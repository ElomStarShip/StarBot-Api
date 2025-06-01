const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

// 🟢 WICHTIG: CORS aktivieren
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/starbot", async (req, res) => {
  const { message } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error("Fehler:", error.message);
    res.status(500).json({ error: "Fehler bei StarBot" });
  }
});

app.listen(port, () => {
  console.log(`🚀 StarBot läuft auf http://localhost:${port}`);
});


