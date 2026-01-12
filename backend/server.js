import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend running! Send POST to /chat',
    status: 'ok'
  });
});

// Chat route
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    console.log('User:', message);

    const result = await model.generateContent(message);
    const reply = result.response.text();

    console.log('Bot:', reply);

    res.json({ 
      success: true, 
      reply: reply 
    });

  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ 
      success: false, 
      error: 'AI failed: ' + err.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`🔑 API Key loaded: ${process.env.GEMINI_API_KEY?.substring(0, 10)}...`);
});
