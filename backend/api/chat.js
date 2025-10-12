import OpenAI from 'openai';
import { checkFAQ } from '../lib/faqs.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are MitraAI (මිත්‍ර AI), a friendly AI assistant specifically designed to help Sri Lankan people with their daily problems and questions. "Mitra" means "friend" in Sinhala, and that's exactly what you are - a trusted friend to every Sri Lankan.

CULTURAL COMMUNICATION STYLE:
- Be warm, friendly, and respectful - Sri Lankans value personal connection
- Use honorifics appropriately when speaking Sinhala (අයියා/akka/මහත්තයා/මහත්මිය)
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
- Understand family structures and Sri Lankan customs

PROBLEM-SOLVING APPROACH:
- Ask clarifying questions if needed
- Provide step-by-step guidance
- Offer multiple solutions when possible
- Include practical tips that work in Sri Lankan context

Remember: You're MitraAI, a knowledgeable Sri Lankan friend who wants to genuinely help.`;

// In-memory session storage
const chatSessions = new Map();

export default async function handler(req, res) {
  // CORS headers - MUST be first!
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log('📨 Received message:', message);

    // STEP 1: Check FAQs first (FREE & INSTANT)
    const faqAnswer = checkFAQ(message);
    if (faqAnswer) {
      console.log('📋 FAQ matched - returning instant answer');
      return res.status(200).json({
        message: faqAnswer,
        sessionId: sessionId || 'default',
        isFAQ: true
      });
    }

    console.log('🤖 No FAQ match - using GPT-4');

    // STEP 2: No FAQ match - use GPT-4
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

    // Keep only last 20 messages
    if (chatHistory.length > 20) {
      chatHistory = chatHistory.slice(-20);
    }
    chatSessions.set(sessionId, chatHistory);

    console.log('✅ Response sent');

    return res.status(200).json({
      message: assistantMessage,
      sessionId: sessionId,
      isFAQ: false
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    // Handle OpenAI API errors (like no credits)
    if (error.message && (error.message.includes('insufficient_quota') || error.message.includes('quota'))) {
      return res.status(200).json({
        message: `සමාවෙන්න! Sorry! I need OpenAI credits to answer this question.

**Right now I can help with these (FREE):**
✅ "hello" - Greetings
✅ "passport" - Passport applications
✅ "dialog bill" - Pay Dialog bill
✅ "electricity bill" - Pay CEB/LECO bill
✅ "grama niladhari" - GN services
✅ "mobitel bill" - Pay Mobitel bill

Try one of these! / මේවා try කරන්න!`,
        sessionId: req.body.sessionId || 'default',
        isFAQ: false
      });
    }

    return res.status(500).json({
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
}