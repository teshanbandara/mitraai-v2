import OpenAI from 'openai';
import { checkFAQ } from '../lib/faqs.js';

// Initialize OpenAI (only if API key exists)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

const SYSTEM_PROMPT = `You are MitraAI (මිත්‍ර AI), a friendly AI assistant specifically designed to help Sri Lankan people with their daily problems and questions. "Mitra" means "friend" in Sinhala.

Be warm, friendly, respectful and helpful. Respond in the same language the user writes in (Sinhala or English). Understand Sri Lankan context, local services, and culture.`;

// In-memory session storage
const chatSessions = new Map();

export default async function handler(req, res) {
  // CORS headers
  const allowedOrigins = [
    'https://mitraai-tau.vercel.app',  // Add your ACTUAL frontend URL here
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');

  // Rest of the code...

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body;

    console.log('📨 Received:', message);

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // ✅ STEP 1: Check FAQs FIRST (highest priority!)
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      console.log('✅ FAQ MATCHED! Returning instant answer');
      return res.status(200).json({
        message: faqAnswer,
        sessionId: sessionId || 'default',
        isFAQ: true
      });
    }

    console.log('ℹ️ No FAQ match found');

    // ✅ STEP 2: If no FAQ, check if OpenAI is available
    if (!openai) {
      console.log('⚠️ OpenAI not configured');
      return res.status(200).json({
        message: `හායි! මට මේ ප්‍රශ්නය හරියටම තේරුණේ නෑ. / Hi! I don't have a premade answer for this yet.

**I can help with these (FREE & INSTANT):**

✅ "hello" - Greetings
✅ "passport" - Passport applications
✅ "dialog bill" - Pay Dialog bill
✅ "electricity bill" - Pay CEB/LECO bill
✅ "mobitel bill" - Pay Mobitel bill
✅ "grama niladhari" - GN services
✅ "ds office" - DS office services
✅ "nic" - National ID card
✅ "driving license" - Get driving license
✅ "water bill" - Pay water bill

Try asking about these! / මේවා ගැන අහන්න!`,
        sessionId: sessionId || 'default',
        isFAQ: false
      });
    }

    // ✅ STEP 3: Use OpenAI for non-FAQ questions
    console.log('🤖 Using OpenAI...');

    let chatHistory = chatSessions.get(sessionId) || [];
    
    chatHistory.push({
      role: 'user',
      content: message
    });

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory.slice(-10) // Keep last 10 messages only
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 800
    });

    const assistantMessage = completion.choices[0].message.content;

    chatHistory.push({
      role: 'assistant',
      content: assistantMessage
    });

    // Keep only last 20 messages
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    chatSessions.set(sessionId, chatHistory);

    console.log('✅ OpenAI response sent');

    return res.status(200).json({
      message: assistantMessage,
      sessionId: sessionId,
      isFAQ: false
    });

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    // Handle specific errors
    if (error.message && (error.message.includes('insufficient_quota') || error.message.includes('quota') || error.message.includes('billing'))) {
      return res.status(200).json({
        message: `සමාවෙන්න! OpenAI credits අවශ්‍යයි මේ ප්‍රශ්නයට.

**But I can help with these (FREE):**

✅ "hello" - Greetings
✅ "passport" - How to get passport
✅ "dialog bill" - Pay Dialog
✅ "electricity bill" - Pay CEB/LECO
✅ "grama niladhari" - GN services

Try one of these! / මේවා try කරන්න!`,
        sessionId: req.body.sessionId || 'default',
        isFAQ: false
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
}