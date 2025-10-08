import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { checkFAQ } from './lib/faqs.js';

dotenv.config();

const app = express();
const PORT = 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `You are MitraAI (මිත්‍ර AI), a friendly AI assistant specifically designed to help Sri Lankan people with their daily problems and questions.`;

const chatSessions = new Map();

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MitraAI server is running' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check FAQs first
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      console.log('📋 FAQ matched');
      return res.json({
        message: faqAnswer,
        sessionId: sessionId,
        isFAQ: true
      });
    }

    // GPT-4 logic here...
    let chatHistory = chatSessions.get(sessionId) || [];
    chatHistory.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = completion.choices[0].message.content;
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    chatSessions.set(sessionId, chatHistory);

    res.json({
      message: assistantMessage,
      sessionId: sessionId,
      isFAQ: false
    });

  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.message?.includes('insufficient_quota')) {
      return res.json({
        message: 'Sorry! Need OpenAI credits. Try FAQ questions like "hello" or "passport"',
        sessionId: sessionId,
        isFAQ: false
      });
    }

    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Local server running on http://localhost:${PORT}`);
  console.log(`📋 Test: http://localhost:${PORT}/api/health`);
});