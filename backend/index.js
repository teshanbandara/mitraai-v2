// This file tells Vercel to use the api/ folder for serverless functions
export default function handler(req, res) {
  res.status(200).json({ 
    message: 'MitraAI API - Use /api/health or /api/chat endpoints' 
  });
}