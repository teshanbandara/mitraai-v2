import OpenAI from 'openai';
import { checkFAQ } from './faqs.js';

const SYSTEM_PROMPT = `You are MitraAI (මිත්‍ර AI), a friendly AI assistant specifically designed to help Sri Lankan people with their daily problems and questions. ...`;

const chatSessions = new Map();

// CORS helper
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://your-frontend.vercel.app'); // Replace with your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  // Preflight request
  if (req.method === 'OPTIONS') return res.status(200).end();

  // === /api/health ===
  if (req.url === '/api/health' && req.method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'MitraAI server is running' });
  }

  // === /api/chat POST ===
  if (req.url === '/api/chat' && req.method === 'POST') {
    try {
      const { message, sessionId } = req.body;
      if (!message) return res.status(400).json({ error: 'Message is required' });

      // 1️⃣ FAQ check
      const faqAnswer = checkFAQ(message);
      if (faqAnswer) return res.json({ message: faqAnswer, sessionId, isFAQ: true });

      // 2️⃣ GPT-4
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      let chatHistory = chatSessions.get(sessionId) || [];
      chatHistory.push({ role: 'user', content: message });

      const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...chatHistory];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      const assistantMessage = completion.choices[0].message.content;
      chatHistory.push({ role: 'assistant', content: assistantMessage });
      if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

      chatSessions.set(sessionId, chatHistory);

      return res.json({ message: assistantMessage, sessionId, isFAQ: false });

    } catch (error) {
      console.error('Error:', error.message);
      if (error.message && error.message.includes('insufficient_quota')) {
        return res.json({
          message: `සමාවෙන්න! Sorry! I need OpenAI credits to answer this question...`,
          sessionId: req.body.sessionId,
          isFAQ: false
        });
      }
      return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }

  // === /api/chat/:sessionId DELETE ===
  if (req.url.startsWith('/api/chat/') && req.method === 'DELETE') {
    const parts = req.url.split('/');
    const sessionId = parts[parts.length - 1];
    chatSessions.delete(sessionId);
    return res.json({ message: 'Chat session cleared' });
  }

  // Fallback
  return res.status(404).json({ error: 'Route not found' });
}
