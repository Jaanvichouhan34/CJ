const express = require('express');
const router = express.Router();
// Removed GoogleGenerativeAI import
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
    
    // Command 1: Lock PC
    if (lowerMsg === 'lock pc' || lowerMsg === 'lock screen' || lowerMsg === 'lock my pc') {
      exec('rundll32.exe user32.dll,LockWorkStation');
      return res.json({ reply: 'Locking your PC right away, sir.' });
    }

    // Command 2: Current Time (Instant fallback)
    if (lowerMsg.includes('what time') || lowerMsg.includes('time is it') || lowerMsg.includes('current time') || lowerMsg.includes("what's the time") || lowerMsg.includes('whats the time') || lowerMsg.includes('tell me the time')) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return res.json({ reply: `The current time is ${timeStr}.` });
    }

    // Command 3: Search Web Dynamically
    if (lowerMsg.startsWith('search for ') || lowerMsg.startsWith('google ')) {
      const query = lowerMsg.replace(/^(search for|google)\s+/i, '').trim();
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      exec(`start chrome "${searchUrl}"`);
      return res.json({ reply: `Searching the web for ${query}.` });
    }

    // Command 4: Empty Recycle Bin
    if (lowerMsg === 'empty trash' || lowerMsg === 'empty recycle bin') {
      exec('PowerShell.exe -NoProfile -Command Clear-RecycleBin -Confirm:$false');
      return res.json({ reply: 'Consider it done. Recycle bin has been emptied.' });
    }

    // Command 5: Open Apps & Websites
    if (lowerMsg.startsWith('open ') || lowerMsg.startsWith('start ') || lowerMsg.startsWith('launch ')) {
      let app = lowerMsg.replace(/^(open|start|launch)\s+/i, '').trim();
      
      const appMap = {
        // Comm & Social
        'whatsapp': 'start whatsapp:',
        'whatshapp': 'start whatsapp:',
        'discord': 'start discord:',
        'telegram': 'start telegram:',
        'instagram': 'start chrome "https://instagram.com"',
        
        // Browsers
        'chrome': 'start chrome',
        'edge': 'start msedge',
        
        // Media
        'spotify': 'start spotify:',
        'spotfy': 'start spotify:',
        'netflix': 'start chrome "https://netflix.com"',
        'youtube': 'start chrome "https://youtube.com"',
        
        // AI & Code
        'chatgpt': 'start chrome "https://chatgpt.com"',
        'chagpt': 'start chrome "https://chatgpt.com"',
        'chat gpt': 'start chrome "https://chatgpt.com"',
        'claude': 'start chrome "https://claude.ai"',
        'perplexity': 'start chrome "https://perplexity.ai"',
        'github': 'start chrome "https://github.com"',
        'vs code': 'code',
        'vscode': 'code',
        'visual studio code': 'code',
        'command prompt': 'start cmd',
        'cmd': 'start cmd',
        'powershell': 'start powershell',
        'cj': 'start cmd /k "cd C:\\Users\\MOHIT\\OneDrive\\Desktop\\CJ"',
        
        // Windows Utilities
        'settings': 'start ms-settings:',
        'calculator': 'start calc',
        'calc': 'start calc',
        'notepad': 'start notepad',
        'paint': 'start mspaint',
        'task manager': 'start taskmgr',
        'file explorer': 'start explorer',
        'explorer': 'start explorer',
        
        // Web Services
        'gmail': 'start chrome "https://mail.google.com"',
        'reddit': 'start chrome "https://reddit.com"',
        'amazon': 'start chrome "https://amazon.com"'
      };

      const baseCmd = appMap[app] || `start ${app}`;
      console.log(`[System Override] Executing natively: ${baseCmd}`);

      exec(baseCmd, (error) => {
        if (error) console.error('[System Override] Failed native execution:', error);
      });
      
      return res.json({ reply: `Right away! I'm opening ${app} for you.` });
    }

    // Command 6: Natural Language Reminders (Jarvis style)
    if (lowerMsg.includes('set reminder') || lowerMsg.includes('remind me') || lowerMsg.includes('set alarm')) {
      // Regex 1: Time (e.g., 2pm, 14:30)
      const timeRegex = /(\d{1,2}(?::\d{2})?\s*(?:am|pm|am|pm|AM|PM)?)/i;
      // Regex 2: Date (e.g., 2 jan, jan 2, 2nd january)
      const dateRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?)/i;
      
      const timeMatch = lowerMsg.match(timeRegex);
      const dateMatch = lowerMsg.match(dateRegex);
      
      if (timeMatch || dateMatch) {
          let rawTime = timeMatch ? timeMatch[0].toLowerCase().trim() : '00:00';
          let rawDate = dateMatch ? dateMatch[0].toLowerCase().trim() : null;

          let msgText = lowerMsg
            .replace(/^(set reminder|remind me|set alarm)\s+/i, '')
            .replace(/at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
            .replace(/on\s+date\s+.*|on\s+\d{1,2}.*|at\s+date\s+.*/i, '') // remove date strings
            .replace(/to\s+/i, '')
            .replace(/for\s+/i, '')
            .trim();

          // Convert 12h to 24h
          let hours = 0, minutes = 0;
          if (timeMatch) {
            let [hPart, mPart] = rawTime.split(':');
            hours = parseInt(hPart, 10);
            minutes = mPart ? parseInt(mPart, 10) : 0;
            if (rawTime.includes('pm') && hours < 12) hours += 12;
            if (rawTime.includes('am') && hours === 12) hours = 0;
          }

          const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          
          // Try to normalize date to YYYY-MM-DD (assume current year if missing)
          let isoDate = null;
          if (rawDate) {
              const d = new Date(`${rawDate} ${new Date().getFullYear()}`);
              if (!isNaN(d.getTime())) {
                  isoDate = d.toISOString().split('T')[0];
              }
          }

          // Write to reminders.json
          try {
            const REMINDERS_FILE = path.join(__dirname, '..', 'data', 'reminders.json');
            let reminders = [];
            if (fs.existsSync(REMINDERS_FILE)) {
              reminders = JSON.parse(fs.readFileSync(REMINDERS_FILE, 'utf8'));
            }
            reminders.push({ 
              time: formattedTime, 
              date: isoDate, // New field for date support
              message: msgText || 'CJ Alert!', 
              fired: false 
            });
            fs.writeFileSync(REMINDERS_FILE, JSON.stringify(reminders, null, 4));

            let responseText = `Consider it done. I've set a reminder`;
            if (rawDate) responseText += ` for ${rawDate}`;
            if (timeMatch) responseText += ` at ${rawTime}`;
            responseText += ` to ${msgText || 'alert you'}.`;

            return res.json({ reply: responseText });
          } catch (e) {
            console.error("Failed to save voice reminder:", e);
          }
      }
    }
    // ---------------------------------------
    // Read API key at request time (not at module load time)
    const apiKey = process.env.GROQ_API_KEY;
    console.log('API Key present:', !!apiKey);

    if (!apiKey) {
      return res.status(500).json({
        error: 'GROQ_API_KEY is not set in environment variables.'
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

    // Build personality prompt based on mode
    const personality = mode === 'friend'
      ? `You are CJ, the best friend of ${ownerName}. Be casual, warm, funny. Keep your response short and concise. Use phrases like ayo, bro, fr fr. Always call them by name.`
      : `You are CJ, a professional AI assistant for ${ownerName}. Be helpful, precise, short and friendly.`;

    // Call Groq API via standard JSON fetch
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
           { role: 'system', content: personality },
           { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('CJ reply:', reply);
    res.json({ reply });

  } catch (error) {
    // Log the FULL error so we can see exactly what went wrong
    console.error('Chat route error:', error.message);
    console.error('Full error:', error);

    // Friendly rate limit message
    if (error.message.includes('429')) {
      return res.status(503).json({
        error: 'CJ is taking a quick breather! Too many requests. Please wait a moment and try again.',
        details: 'Rate limit exceeded on Groq API.'
      });
    }

    res.status(500).json({
      error: 'Failed to get response from CJ',
      details: error.message
    });
  }
});

module.exports = router;
