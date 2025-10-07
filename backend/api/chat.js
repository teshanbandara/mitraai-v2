import { checkFAQ } from '../faqs.js';
import OpenAI from 'openai';

const chatSessions = new Map();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const SYSTEM_PROMPT = `Your SYSTEM_PROMPT here`;

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { message, sessionId } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

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

      res.json({ message: assistantMessage, sessionId, isFAQ: false });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Server error' });
    }
  } else if (method === 'DELETE') {
    const sessionId = req.query.sessionId;
    chatSessions.delete(sessionId);
    res.json({ message: 'Chat session cleared' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
