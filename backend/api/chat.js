// api/chat.js
import { checkFAQ } from "./faqs.js";
import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const openai = OPENAI_KEY ? new OpenAI({ apiKey: OPENAI_KEY }) : null;

// Simple CORS headers
function setCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Or restrict to your frontend URL
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCORS(res);

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  // FAQ check
  try {
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      return res.status(200).json({ message: faqAnswer, sessionId, isFAQ: true });
    }
  } catch (err) {
    console.error("FAQ error:", err);
  }

  // GPT fallback
  if (!openai) {
    return res.status(200).json({
      message: "FAQ not found and OpenAI key missing — cannot answer GPT questions.",
      sessionId,
      isFAQ: false
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are MitraAI, a helpful Sri Lankan assistant." },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const assistantMessage = completion.choices[0].message.content;

    res.status(200).json({ message: assistantMessage, sessionId, isFAQ: false });

  } catch (err) {
    console.error("GPT error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
