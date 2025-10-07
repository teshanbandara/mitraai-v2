import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { checkFAQ } from './faqs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI (will work when you add credits)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Update CORS to allow your frontend domain
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://mitraai-tau.vercel.app/'  // Add your actual URL
  ],
  credentials: true
}));
app.use(express.json());

const SYSTEM_PROMPT = `You are MitraAI (මිත්‍ර AI), a friendly AI assistant specifically designed to help Sri Lankan people with their daily problems and questions. "Mitra" means "friend" in Sinhala, and that's exactly what you are - a trusted friend to every Sri Lankan. You should:

CULTURAL COMMUNICATION STYLE:
- Be warm, friendly, and respectful - Sri Lankans value personal connection
- Use honorifics appropriately when speaking Sinhala (අයිය�?akka/මහත්තය�?මහත්මි�?
- Be patient and thorough - direct "no" can be considered rude, so soften negative responses
- Show empathy and understanding of local challenges (power cuts, economic issues, bureaucracy)
- Use casual, conversational tone while maintaining respect

LANGUAGE HANDLING:
- Respond in the same language the user writes in (Sinhala or English)
- If user mixes languages (common in Sri Lanka), mirror that style
- For Sinhala responses, use proper Sinhala script (not transliteration)

SRI LANKAN CONTEXT AWARENESS:
- Understand local references: Colombo, Kandy, Galle, Sri Lankan cuisine, cricket
- Be aware of common issues: visa problems, government services, electricity bills, transport
- Know about local services: Dialog, Mobitel, SLT, People's Bank, Bank of Ceylon

Remember: You're MitraAI, a knowledgeable Sri Lankan friend who wants to genuinely help.`;

const chatSessions = new Map();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MitraAI server is running' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // STEP 1: Check FAQs first (FREE & INSTANT)
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      console.log('📋 FAQ matched - returning instant answer (FREE)');
      return res.json({
        message: faqAnswer,
        sessionId: sessionId,
        isFAQ: true
      });
    }

    // STEP 2: No FAQ match - try GPT-4
    console.log('🤖 No FAQ match - using GPT-4');
    
    let chatHistory = chatSessions.get(sessionId) || [];

    chatHistory.push({
      role: 'user',
      content: message
    });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    const assistantMessage = completion.choices[0].message.content;

    chatHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

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
    console.error('�?Error:', error.message);
    
    // Handle OpenAI API errors (like no credits)
    if (error.message && error.message.includes('insufficient_quota')) {
      return res.json({
        message: `සමාවෙන්න! Sorry! I need OpenAI credits to answer this question.

**Right now I can help with these (FREE):**
�?Passport applications
�?Pay bills (Dialog, Mobitel, CEB, Water)
�?Government services (GN, DS office)
�?NIC & Driving License

Try asking: "how to pay dialog bill" or "passport application"

Credits will be added soon for all other questions! 🚀`,
        sessionId: req.body.sessionId,
        isFAQ: false
      });
    }

    res.status(500).json({
      error: 'An error occurred while processing your request'
    });
  }
});

app.delete('/api/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  chatSessions.delete(sessionId);
  res.json({ message: 'Chat session cleared' });
});

app.listen(PORT, () => {
  console.log(`�?MitraAI Server running on http://localhost:${PORT}`);
  console.log(`📋 FAQ System: Active (FREE answers)`);
  console.log(`🤖 GPT-4: Ready (needs credits)`);
});
