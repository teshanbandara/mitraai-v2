import { checkFAQ } from '../faqs.js';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are MitraAI...`; // your SYSTEM_PROMPT
const chatSessions = new Map();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { method, url, body } = req;

  // Health check
  if (url === '/api/health' && method === 'GET') {
    return res.status(200).json({ status: 'ok', message: 'MitraAI server is running' });
  }

  // Chat POST
  if (url === '/api/chat' && method === 'POST') {
    const { message, sessionId } = body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const faqAnswer = checkFAQ(message);
    if (faqAnswer) return res.json({ message: faqAnswer, sessionId, isFAQ: true });

    let chatHistory = chatSessions.get(sessionId) || [];
    chatHistory.push({ role: 'user', content: message });

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...chatHistory];

    try {
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
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }

  // Delete chat session
  if (url.startsWith('/api/chat/') && method === 'DELETE') {
    const sessionId = url.split('/').pop();
    chatSessions.delete(sessionId);
    return res.json({ message: 'Chat session cleared' });
  }

  return res.status(404).json({ error: 'Route not found' });
}
