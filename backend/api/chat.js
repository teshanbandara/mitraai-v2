import OpenAI from "openai";
import dotenv from "dotenv";
import { checkFAQ } from "../lib/faqs.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are MitraAI... (keep your long prompt here)`;

// Vercel-style function export
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const faq = checkFAQ(message);
    if (faq) {
      return res.status(200).json({ message: faq, isFAQ: true });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 1000,
    });

    res.status(200).json({
      message: completion.choices[0].message.content,
      isFAQ: false,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
