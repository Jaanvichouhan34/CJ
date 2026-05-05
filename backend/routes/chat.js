const express = require('express');
const router = express.Router();
// Removed GoogleGenerativeAI import
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const Chat = require('../models/Chat');
const User = require('../models/User');

// GET: Fetch recent chat history
router.get('/history', async (req, res) => {
  try {
    const history = await Chat.find().sort({ timestamp: -1 }).limit(10);
    res.json(history.reverse().map(c => ({
      role: c.role === 'assistant' ? 'bot' : 'user',
      text: c.content,
      time: new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Log the incoming request so we can debug
    console.log('Chat request received:', req.body);

    const { message, mode } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // --- JARVIS SYSTEM CONTROL OVERRIDE ---
    let lowerMsg = message.toLowerCase().trim();
    // Remove common prefixes
    lowerMsg = lowerMsg.replace(/^(hey|cj|assistant|friend)[,\s]*/i, '');
    
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
    if (lowerMsg.match(/^(search for|google|find)\s+/i)) {
      const query = lowerMsg.replace(/^(search for|google|find)\s+/i, '').replace(/[?!.]$/, '').trim();
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
    if (lowerMsg.match(/^(open|start|launch)\s+/i)) {
      let app = lowerMsg.replace(/^(open|start|launch)\s+/i, '').replace(/[?!.]$/, '').trim();
      
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
        'microsoft edge': 'start msedge',
        
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
        'antigravity': 'start antigravity',
        'command prompt': 'start cmd',
        'cmd': 'start cmd',
        'powershell': 'start powershell',
        'cj': 'start cmd /k "cd C:\\Users\\MOHIT\\OneDrive\\Desktop\\CJ"',
        
        // Windows Utilities & Apps
        'settings': 'start ms-settings:',
        'calculator': 'start calc',
        'calc': 'start calc',
        'notepad': 'start notepad',
        'paint': 'start mspaint',
        'task manager': 'start taskmgr',
        'file explorer': 'start explorer',
        'explorer': 'start explorer',
        'camera': 'start microsoft.windows.camera:',
        'calendar': 'start ms-calendar:',
        'microsoft store': 'start ms-windows-store:',
        'xbox': 'start xbox:',
        
        // Settings / Hardware
        'bluetooth': 'start ms-settings:bluetooth',
        'wifi': 'start ms-settings:network-wifi',
        'airplane mode': 'start ms-settings:network-airplanemode',
        'lock screen': 'rundll32.exe user32.dll,LockWorkStation',
        'lock pc': 'rundll32.exe user32.dll,LockWorkStation',
        
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

    // Command 6: System Hardware Health (Battery/RAM)
    if (lowerMsg.includes('battery') || lowerMsg.includes('power') || lowerMsg.includes('charging')) {
      return new Promise((resolve) => {
        exec('powershell "(Get-CimInstance -ClassName Win32_Battery).EstimatedChargeRemaining"', (error, stdout) => {
          const battery = stdout ? stdout.trim() : null;
          if (battery && !isNaN(battery) && battery !== '') {
            resolve(res.json({ reply: `Your laptop is currently at ${battery}% battery, sir.` }));
          } else {
            resolve(res.json({ reply: "I couldn't detect a battery. This usually happens on Desktop PCs, or if the battery driver is hidden." }));
          }
        });
      });
    }

    if (lowerMsg.includes('ram') || lowerMsg.includes('memory') || lowerMsg.includes('system health') || lowerMsg.includes('specs')) {
      return new Promise((resolve) => {
        // Simple command that returns Free and Total memory on two lines
        const cmd = 'powershell "(Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory; (Get-CimInstance Win32_OperatingSystem).TotalVisibleMemorySize; (Get-CimInstance -ClassName Win32_Battery).EstimatedChargeRemaining"';
        exec(cmd, (error, stdout) => {
          if (error) {
            console.error("RAM Exec Error:", error);
            return resolve(res.json({ reply: "I'm having trouble accessing your system sensors right now." }));
          }
          
          const matches = stdout ? stdout.match(/\d+/g) : [];
          if (matches && matches.length >= 2) {
            const freeKB = parseInt(matches[0]);
            const totalKB = parseInt(matches[1]);
            const battery = matches[2] || null;

            if (!isNaN(freeKB) && !isNaN(totalKB)) {
              const totalGB = Math.round(totalKB / 1024 / 1024);
              const usedGB = Math.round((totalKB - freeKB) / 1024 / 1024);
              
              let reply = `You are currently using ${usedGB}GB of RAM out of ${totalGB}GB.`;
              if (battery) reply += ` Your battery is at ${battery}%.`;
              reply += ` Overall, your system health is looking great!`;
              
              return resolve(res.json({ reply }));
            }
          }
          resolve(res.json({ reply: "I can see your system, but I'm having trouble calculating the exact RAM usage at the moment." }));
        });
      });
    }

    // Command 7: Brightness Control
    if (lowerMsg.includes('brightness') && (lowerMsg.includes('set') || lowerMsg.includes('increase') || lowerMsg.includes('decrease') || lowerMsg.includes('change'))) {
      let level = 50; // Default
      if (lowerMsg.includes('high') || lowerMsg.includes('max')) level = 100;
      if (lowerMsg.includes('low') || lowerMsg.includes('min')) level = 10;
      if (lowerMsg.includes('medium')) level = 50;
      
      const numMatch = lowerMsg.match(/\d+/);
      if (numMatch) level = parseInt(numMatch[0]);

      exec(`powershell "(Get-WmiObject -Namespace root/WMI -Class WmiMonitorBrightnessMethods).WmiSetBrightness(1, ${level})"`);
      return res.json({ reply: `Adjusting your screen brightness to ${level} percent.` });
    }

    // Command 8: Natural Language Reminders (Improved parser)
    if (lowerMsg.includes('reminder') || lowerMsg.includes('remind me') || lowerMsg.includes('set alarm') || 
       (lowerMsg.includes('date') && lowerMsg.includes('time') && lowerMsg.includes('event'))) {
      
      // Regex 1: Time (e.g., 2pm, 14:30, 12 pm)
      const timeRegex = /(\d{1,2}(?::\d{2})?\s*(?:am|pm|am|pm|AM|PM)?)/i;
      // Regex 2: Date (e.g., 2 jan, jan 2, 2nd january, 24 april 2026)
      const dateRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{0,4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2}(?:st|nd|rd|th)?\s*\d{0,4})/i;
      
      const timeMatch = lowerMsg.match(timeRegex);
      const dateMatch = lowerMsg.match(dateRegex);
      
      if (timeMatch || dateMatch) {
          let rawTime = timeMatch ? timeMatch[0].toLowerCase().trim() : '00:00';
          let rawDate = dateMatch ? dateMatch[0].toLowerCase().trim() : null;

          let msgText = lowerMsg
            .replace(/^(set reminder|remind me|set alarm|reminder)\s+/i, '')
            .replace(/at\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
            .replace(/on\s+date\s+.*|on\s+\d{1,2}.*|at\s+date\s+.*/i, '') // remove date strings
            .replace(/date\s+.*?\s+event/i, '') // handle "date ... event" format
            .replace(/event\s+/i, '')
            .replace(/time\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)?/i, '')
            .replace(/to\s+/i, '')
            .replace(/for\s+/i, '')
            .trim();

          // Convert 12h to 24h
          let hours = 0, minutes = 0;
          if (timeMatch) {
            // Remove spaces before am/pm for easier splitting
            const cleanedTime = rawTime.replace(/\s+(am|pm)/i, '$1');
            const match = cleanedTime.match(/(\d{1,2})(?::(\d{2}))?(am|pm)?/i);
            if (match) {
              hours = parseInt(match[1], 10);
              minutes = match[2] ? parseInt(match[2], 10) : 0;
              const ampm = match[3];
              if (ampm === 'pm' && hours < 12) hours += 12;
              if (ampm === 'am' && hours === 12) hours = 0;
            }
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

    // 1. Load owner name (Use local JSON fallback first for maximum speed)
    let ownerName = 'Friend';
    try {
      const memoryPath = path.join(__dirname, '../../desktop/memory.json');
      if (fs.existsSync(memoryPath)) {
        const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf8'));
        if (memory.name) ownerName = memory.name;
      }
    } catch (e) {
      console.log('Using default owner name');
    }

    // 2. Fetch history (Limit to 8 for a good balance)
    let history = [];
    try {
      const recentChats = await Chat.find().sort({ timestamp: -1 }).limit(8);
      history = recentChats.reverse().map(c => ({ role: c.role, content: c.content }));
    } catch (e) {
      console.error('History fetch failed, skipping');
    }

    // 3. Build personality and call Groq
    const personality = mode === 'friend'
      ? `You are CJ, the best friend of ${ownerName}. Be casual, warm, funny. Response: very short/concise.`
      : `You are CJ, a professional AI for ${ownerName}. Be helpful, precise, very short.`;

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
           ...history,
           { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 150 // Limit output size to speed up response
      })
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // 3. Save both messages to DB (AWAIT this to ensure it saves on free tiers)
    try {
      await Chat.create([
        { role: 'user', content: message },
        { role: 'assistant', content: reply }
      ]);
      console.log('✅ Chat saved to MongoDB');
    } catch (e) {
      console.error('❌ DB Save Error:', e);
    }

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
