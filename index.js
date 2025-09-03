import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

// Webhook verify
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Webhook receive
app.post("/webhook", async (req, res) => {
  if (req.body.object === "page") {
    for (const entry of req.body.entry) {
      const event = entry.messaging && entry.messaging[0];
      if (!event) continue;

      const senderId = event.sender?.id;
      if (event.message?.text) {
        const text = event.message.text.trim();

        if (text.startsWith("/help")) {
          await sendQuickReplies(senderId);
        } else if (text.startsWith("/search ")) {
          const query = text.replace("/search ", "");
          const reply = await askOpenAI(query, true);
          await sendTextMessage(senderId, reply);
        } else if (text.startsWith("/summarize ")) {
          const content = text.replace("/summarize ", "");
          const reply = await askOpenAI(`এই টেক্সট/লিঙ্কের সারাংশ দাও: ${content}`);
          await sendTextMessage(senderId, reply);
        } else {
          const reply = await askOpenAI(text);
          await sendTextMessage(senderId, reply);
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// OpenAI request
async function askOpenAI(userText, forceSearch = false) {
  try {
    const systemPrompt =
      "তুমি একজন বন্ধুসুলভ বাংলা সহকারী। ছোট বাক্যে সহজ ভাষায় উত্তর দাও।";

    const resp = await axios.post(
      "https://api.openai.com/v1/responses",
      {
        model: OPENAI_MODEL,
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText }
        ],
        tools: forceSearch ? [{ type: "web_search" }] : []
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return resp.data.output_text || "❌ কিছু ভুল হয়েছে!";
  } catch (err) {
    console.error(err.response?.data || err.message);
    return "⚠️ আমি সমস্যায় পড়েছি!";
  }
}

// Messenger helpers
async function sendTextMessage(recipientId, text) {
  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  await axios.post(url, {
    recipient: { id: recipientId },
    message: { text }
  });
}

async function sendQuickReplies(recipientId) {
  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;
  const payload = {
    recipient: { id: recipientId },
    message: {
      text: "কমান্ড বেছে নাও 👇",
      quick_replies: [
        { content_type: "text", title: "🔍 সার্চ", payload: "/search ঢাকা আবহাওয়া" },
        { content_type: "text", title: "📝 সারাংশ", payload: "/summarize Neymar news" },
        { content_type: "text", title: "ℹ️ সাহায্য", payload: "/help" }
      ]
    }
  };
  await axios.post(url, payload);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
