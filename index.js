const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

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
