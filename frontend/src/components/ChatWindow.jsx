import { useState, useRef, useEffect } from 'react';
import VoiceButton from './VoiceButton';
import { speak, stopSpeaking } from '../utils/voice';

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('assistant');
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState(null);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
    setInput('');
    setIsTyping(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode })
      });
      const data = await res.json();
      
      const reply = data.reply || 'Sorry, I got an error.';
      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      
      speak(reply);
      
    } catch (err) {
      console.error(err);
      const errMsg = 'Sorry, I am offline.';
      setMessages(prev => [...prev, { role: 'bot', text: errMsg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
      speak(errMsg);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'relative', height: '100%', zIndex: 5 }}>
      
      {/* Header */}
      <div className="glass-card" style={{ padding: '1.2rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.4rem', margin: 0, fontWeight: '600' }}>Conversation</h2>
        
        {/* Toggle Mode */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '0.95rem', fontWeight: mode === 'assistant' ? '600' : '400', color: mode === 'assistant' ? 'var(--accent-blue)' : 'var(--text-muted)' }}>Assistant</span>
          
          <div onClick={toggleMode} style={{
              width: '60px', height: '32px', borderRadius: '16px',
              background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border)',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.3s ease'
          }}>
            <div style={{
              position: 'absolute', top: '3px', left: mode === 'assistant' ? '3px' : '31px',
              width: '24px', height: '24px', borderRadius: '50%',
              background: mode === 'assistant' ? 'var(--accent-blue)' : 'linear-gradient(135deg, var(--accent-purple), var(--accent-pink))',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              boxShadow: mode === 'assistant' ? '0 0 15px rgba(0, 200, 255, 0.6)' : '0 0 15px rgba(168, 85, 247, 0.6)'
            }}></div>
          </div>
          
          <span style={{ fontSize: '0.95rem', fontWeight: mode === 'friend' ? '600' : '400', color: mode === 'friend' ? 'var(--accent-purple)' : 'var(--text-muted)' }}>Friend</span>
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
      <div className="glass-card" style={{
        flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto', display: 'flex', flexDirection:'column', alignItems: 'center', gap: '20px' }}>
            <div className="anim-pulse-glow" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', justifyContent:'center', alignItems:'center', fontSize:'3rem'}}>👋</div>
            <h2>Say Hello to CJ</h2>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div key={i} className="anim-slide-up" style={{
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            display: 'flex', gap: '15px', maxWidth: '80%',
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
          }}>
            {msg.role === 'bot' && (
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'
              }}>CJ</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              <div style={{
                background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(0, 200, 255, 0.15), rgba(168, 85, 247, 0.1))' : 'var(--bg-card)',
                border: msg.role === 'user' ? '1px solid rgba(0, 200, 255, 0.2)' : '1px solid var(--border)',
                padding: '16px 20px', borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                fontSize: '1.05rem', lineHeight: '1.5',
                boxShadow: msg.role === 'user' ? '0 5px 15px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.1)'
              }}>
                {msg.text}
                
                {msg.role === 'bot' && (
                  <button onClick={() => speak(msg.text)} style={{background:'transparent', border:'none', cursor:'pointer', float:'right', marginLeft:'10px', opacity:'0.5'}}>🔊</button>
                )}
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', padding: '0 5px' }}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        
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
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="glass-card" style={{ display: 'flex', gap: '12px', padding: '1rem', alignItems: 'center' }}>
        <input 
          type="text" 
          className="glow-input"
          style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
          placeholder="Message CJ..." 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <VoiceButton onResult={(text) => sendMessage(text)} />
        <button className="glow-button outline" onClick={stopSpeaking} style={{ padding: '14px 20px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 10, borderColor: 'var(--accent-pink)' }}>
          Stop ⏹️
        </button>
        <button className="glow-button" onClick={() => sendMessage(input)} style={{ padding: '14px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Send <span>➔</span>
        </button>
      </div>

    </div>
  );
}
