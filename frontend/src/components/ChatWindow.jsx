import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Square, Zap, Volume2, Cpu, Sparkles } from 'lucide-react';
import VoiceButton from './VoiceButton';
import { speak, stopSpeaking } from '../utils/voice';
import BASE_URL from '../config.js';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('assistant');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleMode = () => {
    const newMode = mode === 'assistant' ? 'friend' : 'assistant';
    setMode(newMode);

    const txt = newMode === 'friend'
      ? "Switching to friend mode, let's vibe!"
      : "Switching to assistant mode, let's get to work!";

    speak(txt);
    showToast(newMode === 'friend' ? 'Friend Mode Active ✌️' : 'Assistant Mode Active 🤖');
  };

  const handleSystemCommand = (text) => {
    let lower = text.toLowerCase().trim();
    // Remove common prefixes and punctuation at the end
    lower = lower.replace(/^(hey|cj|assistant|friend)[,\s]*/i, '');

    // Command: Lock / Trash (Local only notice)
    if (lower.includes('lock pc') || lower.includes('lock screen') || lower.includes('empty trash')) {
      const reply = "I can only control hardware (like locking your PC or emptying trash) if I'm running as a Desktop app. On the web version, I'm a bit more limited, bro!";
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speak(reply);
      return true;
    }

    // Command: Time
    if (lower.includes('what time') || lower.includes('time is it') || lower.includes('current time')) {
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const reply = `The current time is ${timeStr}.`;
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speak(reply);
      return true;
    }

    // Command: Search
    if (lower.match(/^(search for|google|find)\s+/i)) {
      const query = lower.replace(/^(search for|google|find)\s+/i, '').replace(/[?!.]$/, '').trim();
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      const reply = `Searching the web for ${query}.`;
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speak(reply);
      return true;
    }

    // Command: Open App/Site
    if (lower.match(/^(open|start|launch)\s+/i)) {
      let app = lower.replace(/^(open|start|launch)\s+/i, '').replace(/[?!.]$/, '').trim();
      const appMap = {
        'whatsapp': 'https://web.whatsapp.com',
        'whatshapp': 'https://web.whatsapp.com',
        'spotify': 'https://open.spotify.com/',
        'spotfy': 'https://open.spotify.com/',
        'discord': 'https://discord.com/',
        'youtube': 'https://youtube.com',
        'instagram': 'https://instagram.com',
        'netflix': 'https://netflix.com',
        'gmail': 'https://mail.google.com',
        'chatgpt': 'https://chatgpt.com',
        'claude': 'https://claude.ai',
        'github': 'https://github.com',
        'camera': 'backend',
        'calculator': 'backend',
        'calendar': 'backend',
        'microsoft store': 'backend',
        'xbox': 'backend',
        'microsoft edge': 'backend',
        'antigravity': 'backend'
      };

      const url = appMap[app];
      if (url) {
        if (url === 'backend') return false; // Handled by backend native trigger
        window.open(url, '_blank');
        const reply = `Right away! I'm opening ${app} for you.`;
        setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        speak(reply);
        return true;
      }
    }

    return false; // Not a system command
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');

    // Check for system override commands locally before sending to backend
    if (handleSystemCommand(text)) return;

    setIsTyping(true);

    try {
      const settings = {
        humor: localStorage.getItem('cj_humor') || '50',
        empathy: localStorage.getItem('cj_empathy') || '50',
        tone: localStorage.getItem('cj_tone') || 'normal'
      };

      const res = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode, settings })
      });
      const data = await res.json();

      // Use server's error message if available, or fallback
      const reply = data.reply || data.error || 'Sorry, I got an error.';
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);

      speak(reply);

    } catch (err) {
      console.error(err);
      const errMsg = 'Sorry, I am offline. Check your connection.';
      setMessages(prev => [...prev, { role: 'bot', text: errMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speak(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', height: '100%', zIndex: 5 }}>

      {/* Header */}
      <div className="glass-card" style={{ padding: '1.2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-blue)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '600', fontFamily: 'Orbitron', letterSpacing: '1px' }}>DATA_STREAM</h2>
        </div>

        {/* Toggle Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.95rem', fontFamily: 'Rajdhani', fontWeight: mode === 'assistant' ? '700' : '400', color: mode === 'assistant' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>ASSISTANT</span>

          <div onClick={toggleMode} style={{
            width: '60px', height: '32px', borderRadius: '16px',
            background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)',
            position: 'relative', cursor: 'pointer',
            transition: 'background 0.3s ease'
          }}>
            <motion.div 
              animate={{ left: mode === 'assistant' ? '3px' : '31px' }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                position: 'absolute', top: '3px',
                width: '24px', height: '24px', borderRadius: '50%',
                background: mode === 'assistant' ? 'var(--accent-blue)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
                boxShadow: mode === 'assistant' ? '0 0 15px rgba(0, 200, 255, 0.6)' : '0 0 15px rgba(168, 85, 247, 0.6)'
              }}
            />
          </div>

          <span style={{ fontSize: '0.95rem', fontFamily: 'Rajdhani', fontWeight: mode === 'friend' ? '700' : '400', color: mode === 'friend' ? 'var(--accent-purple)' : 'var(--text-muted)' }}>FRIEND</span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="anim-slide-down glass-card" style={{
          position: 'absolute', top: '80px', right: '10px',
          padding: '12px 24px', zIndex: 20,
          background: mode === 'friend' ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 200, 255, 0.15)',
          borderLeft: `4px solid ${mode === 'friend' ? 'var(--accent-purple)' : 'var(--accent-blue)'}`
        }}>
          {toast}
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="glass-card" style={{
        flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
              className="anim-pulse-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'transparent', border: '2px dashed var(--accent-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Cpu size={40} color="var(--accent-blue)" />
            </motion.div>
            <h2 style={{ fontFamily: 'Orbitron', letterSpacing: '2px', color: 'var(--accent-blue)', textShadow: '0 0 10px rgba(0,240,255,0.4)' }}>SYSTEM STANDBY</h2>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 400 }}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                display: 'flex', gap: '15px', maxWidth: '80%',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}>
              {msg.role === 'bot' && (
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)', fontFamily: 'Orbitron', fontSize: '0.9rem'
                }}>CJ</div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{
                  background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 100, 255, 0.1))' : 'var(--bg-card)',
                  border: msg.role === 'user' ? '1px solid rgba(0, 240, 255, 0.3)' : '1px solid var(--border)',
                  borderLeft: msg.role === 'bot' ? '3px solid var(--accent-purple)' : '1px solid var(--border)',
                  padding: '16px 20px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  fontSize: '1.05rem', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', fontWeight: '400',
                  boxShadow: msg.role === 'user' ? '0 5px 20px rgba(0,240,255,0.05)' : '0 5px 20px rgba(176,38,255,0.05)',
                  letterSpacing: '0.3px', color: 'var(--text-primary)'
                }}>
                  {msg.text}

                  {msg.role === 'bot' && (
                    <button onClick={() => speak(msg.text)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', float: 'right', marginLeft: '10px', color: 'var(--accent-blue)', opacity: '0.7', transition: 'opacity 0.2s' }} onMouseEnter={e => e.target.style.opacity=1} onMouseLeave={e => e.target.style.opacity=0.7}>
                      <Volume2 size={18} />
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.8rem', fontFamily: 'Orbitron', color: 'var(--text-muted)', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', padding: '0 5px', opacity: 0.5 }}>
                  {msg.time}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="anim-slide-up" style={{ alignSelf: 'flex-start', display: 'flex', gap: '15px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--text-muted), var(--bg-card))',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>CJ</div>
            <div style={{ display: 'flex', gap: '8px', padding: '16px 20px', background: 'var(--bg-card)', borderRadius: '20px 20px 20px 4px', border: '1px solid var(--border)' }}>
              <div className="anim-wave-dots" style={{ width: '8px', height: '8px', background: 'var(--accent-blue)', borderRadius: '50%', animation: 'waveDots 1s infinite ease-in-out' }}></div>
              <div className="anim-wave-dots" style={{ width: '8px', height: '8px', background: 'var(--accent-blue)', borderRadius: '50%', animation: 'waveDots 1s infinite ease-in-out 0.2s' }}></div>
              <div className="anim-wave-dots" style={{ width: '8px', height: '8px', background: 'var(--accent-blue)', borderRadius: '50%', animation: 'waveDots 1s infinite ease-in-out 0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '1.2rem', position: 'relative' }}>

        {/* Quick Action Chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
          {[
            { label: 'Check Battery 🔋', cmd: 'What is my battery level?' },
            { label: 'RAM Usage 🧠', cmd: 'Check my RAM usage' },
            { label: 'Flip a Coin 🪙', cmd: 'Flip a coin' },
            { label: 'Tell a Joke 😂', cmd: 'Tell me a joke' },
            { label: 'Current Time ⏰', cmd: 'What time is it?' },
            { label: 'Brightness 🔆', cmd: 'Set brightness to 80%' },
            { label: 'Empty Trash 🗑️', cmd: 'Empty recycle bin' },
            { label: 'Lock PC 🔒', cmd: 'Lock my PC' },
            { label: 'Open VS Code 💻', cmd: 'Open VS Code' },
            { label: 'YouTube 🎬', cmd: 'Open YouTube' },
            { label: 'WhatsApp 🟢', cmd: 'Open WhatsApp' },
            { label: 'Spotify 🎵', cmd: 'Open Spotify' },
            { label: 'Google Search 🔍', cmd: 'Search for CJ AI Assistant' }
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(chip.cmd)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: '6px 14px',
                color: 'var(--text-muted)',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 200, 255, 0.1)';
                e.currentTarget.style.borderColor = 'var(--accent-blue)';
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.borderColor = 'var(--border)';
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%' }}>
          <input
            type="text"
            className="glow-input"
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', fontFamily: 'Rajdhani', fontSize: '1.2rem', letterSpacing: '1px' }}
            placeholder="ENTER COMMAND OR MESSAGE..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          />
          <VoiceButton onResult={(text) => sendMessage(text)} />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-button outline" onClick={stopSpeaking} style={{ padding: '14px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, borderColor: 'var(--accent-pink)' }}>
            <Square size={18} />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glow-button" onClick={() => sendMessage(input)} style={{ padding: '14px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>TRANSMIT</span> <Send size={18} />
          </motion.button>
        </div>
      </div>

    </div>
  );
}
