const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

router.post('/', async (req, res) => {
  try {
    // Log the incoming request so we can debug
    console.log('Chat request received:', req.body);

    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // --- JARVIS SYSTEM CONTROL OVERRIDE ---
    const lowerMsg = message.toLowerCase().trim();
    if (lowerMsg.startsWith('open ') || lowerMsg.startsWith('start ')) {
      let app = lowerMsg.replace(/^(open|start)\s+/i, '').trim();
      
      const appMap = {
        'whatsapp': 'start whatsapp:',
        'spotify': 'start spotify:',
        'vs code': 'code',
        'vscode': 'code',
        'visual studio code': 'code',
        'chrome': 'start chrome',
        'youtube': 'start chrome "https://youtube.com"',
        'instagram': 'start chrome "https://instagram.com"',
        'chatgpt': 'start chrome "https://chatgpt.com"',
        'claude': 'start chrome "https://claude.ai"',
        'perplexity': 'start chrome "https://perplexity.ai"',
        'antigravity': 'start cmd /k "cd C:\\Users\\MOHIT\\OneDrive\\Desktop\\CJ"',
        'cj': 'start cmd /k "cd C:\\Users\\MOHIT\\OneDrive\\Desktop\\CJ"'
      };

      const baseCmd = appMap[app] || `start ${app}`;
      console.log(`[System Override] Executing natively: ${baseCmd}`);

      exec(baseCmd, (error) => {
        if (error) {
          console.error('[System Override] Failed native execution:', error);
        }
      });
      
      return res.json({ reply: `Right away! I'm opening ${app} for you now on your system.` });
    }
    // ---------------------------------------
    // Read API key at request time (not at module load time)
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('API Key present:', !!apiKey);

    if (!apiKey) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not set in environment variables.'
      });
    }

    // Load owner memory for personalization
    let ownerName = 'friend';
    try {
      const memoryPath = path.join(__dirname, '../../desktop/memory.json');
      if (fs.existsSync(memoryPath)) {
        const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
        if (memory.name) ownerName = memory.name;
      }
    } catch (e) {
      console.log('Could not load memory.json, using default name');
    }

    // Initialize Gemini inside the handler so dotenv is already loaded
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

    // Build personality prompt based on mode
    const personality = mode === 'friend'
      ? `You are CJ, the best friend of ${ownerName}. Be casual, warm, funny. Use phrases like ayo, bro, fr fr. Always call them by name.`
      : `You are CJ, a professional AI assistant for ${ownerName}. Be helpful, precise, and friendly.`;

    const fullPrompt = `${personality}\n\nUser says: ${message}`;

    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const reply = result.response.text();

    console.log('CJ reply:', reply);
    res.json({ reply });

  } catch (error) {
    // Log the FULL error so we can see exactly what went wrong
    console.error('Chat route error:', error.message);
    console.error('Full error:', error);

    // Friendly rate limit message
    if (error.status === 429) {
      return res.status(503).json({
        error: 'CJ is taking a quick breather! Too many requests. Please wait a moment and try again.',
        details: 'Rate limit exceeded on Gemini API free tier.'
      });
    }

    res.status(500).json({
      error: 'Failed to get response from CJ',
      details: error.message
    });
  }
});

module.exports = router;
