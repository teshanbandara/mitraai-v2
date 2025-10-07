// backend/api/chat.js
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { checkFAQ } from './faqs.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1️⃣ Check FAQ first (FREE & instant)
  try {
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      console.log('📋 FAQ matched:', faqAnswer);
      return res.status(200).json({
        message: faqAnswer,
        sessionId,
        isFAQ: true
      });
    }
  } catch (err) {
    console.error('FAQ check failed:', err);
  }

  // 2️⃣ If no FAQ match, call GPT (needs credits)
  try {
    console.log('🤖 No FAQ match - using GPT');

    const messages = [
      { role: 'system', content: 'You are MitraAI, a helpful Sri Lankan assistant.' },
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantMessage = completion.choices[0].message.content;

    res.status(200).json({
      message: assistantMessage,
      sessionId,
      isFAQ: false
    });

  } catch (error) {
    console.error('GPT Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
