import { useState, useEffect } from 'react';
import { speak, setVoiceGender } from '../utils/voice';

export default function Settings({ theme, setTheme }) {
  const [voiceSettings, setVoiceSettings] = useState({
    gender: localStorage.getItem('cj_voice_gender') || 'male',
    speed: localStorage.getItem('cj_voice_speed') || '1.0'
  });

  const [personality, setPersonality] = useState({
    humor: localStorage.getItem('cj_humor') || '50',
    empathy: localStorage.getItem('cj_empathy') || '50',
    tone: localStorage.getItem('cj_tone') || 'normal'
  });

  const [notifications, setNotifications] = useState(Notification.permission);

  const handlePersonalityChange = (field, value) => {
    const updated = { ...personality, [field]: value };
    setPersonality(updated);
    localStorage.setItem(`cj_${field}`, value);
  };

  const handleVoiceChange = (field, value) => {
    const updated = { ...voiceSettings, [field]: value };
    setVoiceSettings(updated);
    if (field === 'gender') {
      setVoiceGender(value);
    }
    if (field === 'speed') {
      localStorage.setItem('cj_voice_speed', value);
    }
  };

  const testVoice = () => {
    speak("Hi Jaanvi, this is how I sound! I'm ready to assist you.");
  };

  const requestNotification = () => {
    Notification.requestPermission().then(perm => {
      setNotifications(perm);
    });
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 5, position: 'relative', animation: 'slideUp 0.4s easeOut', overflow: 'hidden' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '-10px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, var(--text-primary), var(--text-muted))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          System Settings
        </h2>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '5px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>v1.0.0 Stable</span>
      </div>

      <div className="glass-card" style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '3rem', overflowY: 'auto', position: 'relative' }}>

        {/* Subtle background glow effect inside the card */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(0,200,255,0.05) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }}></div>

        {/* Voice Settings */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-blue), rgba(0, 200, 255, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem' }}>
              🗣️
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>Voice Preferences</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Voice Persona</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'male', label: '👨 Male (US)' },
                  { id: 'female', label: '👩 Female (US)' },
                  { id: 'uk_male', label: '💂 UK Male' },
                  { id: 'uk_female', label: '🫖 UK Female' },
                  { id: 'robot', label: '🤖 Robot' },
                  { id: 'child', label: '🧒 Child' }
                ].map(v => (
                  <button
                    key={v.id}
                    className={`glow-button outline ${voiceSettings.gender === v.id ? 'active' : ''}`}
                    onClick={() => handleVoiceChange('gender', v.id)}
                    style={{
                      flex: '1 1 45%', height: '45px', fontSize: '0.9rem',
                      background: voiceSettings.gender === v.id ? 'rgba(0,200,255,0.1)' : 'transparent',
                      borderColor: voiceSettings.gender === v.id ? 'var(--accent-blue)' : 'var(--border)'
                    }}
                  >{v.label}</button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Speaking Speed</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '55px', background: 'var(--bg-card)', padding: '0 20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.2rem' }}>🐢</span>
                <input type="range" min="0.5" max="1.5" step="0.1"
                  value={voiceSettings.speed}
                  onChange={(e) => handleVoiceChange('speed', e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent-blue)', height: '6px' }}
                />
                <span style={{ fontSize: '1.2rem' }}>🐇</span>
              </div>
            </div>
          </div>

          <button className="glow-button outline" onClick={testVoice} style={{ marginTop: '1.5rem', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔊</span> Test Voice Sound
          </button>
        </section>

        <hr style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

        {/* UI Themes */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-blue), rgba(0, 200, 255, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem' }}>
              🎨
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>Interface Theme</h3>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
            {['default', 'synthwave', 'minimalist', 'hacker', 'ocean', 'sunset', 'forest', 'monochrome', 'nebula', 'dracula'].map(t => (
              <button
                key={t}
                className={`glow-button outline ${theme === t ? 'active' : ''}`}
                onClick={() => setTheme(t)}
                style={{
                  flex: '1 1 18%', height: '45px', fontSize: '0.95rem', textTransform: 'capitalize',
                  background: theme === t ? 'rgba(0,200,255,0.1)' : 'transparent',
                  borderColor: theme === t ? 'var(--accent-blue)' : 'var(--border)',
                  whiteSpace: 'nowrap'
                }}
              >
                {t === 'default' ? 'Cyber 2099' : t}
              </button>
            ))}
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

        {/* Personality Engine */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
            <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-purple), rgba(176, 38, 255, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.4rem' }}>
              🧠
            </div>
            <h3 style={{ fontSize: '1.4rem', margin: 0, fontWeight: 600 }}>Personality Core</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span>Humor Level</span>
                <span style={{ color: 'var(--accent-blue)' }}>{personality.humor}%</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>😐</span>
                <input type="range" min="0" max="100" step="10"
                  value={personality.humor}
                  onChange={(e) => handlePersonalityChange('humor', e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent-blue)', height: '6px' }}
                />
                <span>😂</span>
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                <span>Empathy Level</span>
                <span style={{ color: 'var(--accent-purple)' }}>{personality.empathy}%</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>🤖</span>
                <input type="range" min="0" max="100" step="10"
                  value={personality.empathy}
                  onChange={(e) => handlePersonalityChange('empathy', e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent-purple)', height: '6px' }}
                />
                <span>❤️</span>
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem', fontWeight: 500, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Conversational Tone</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {['normal', 'sarcastic', 'professional'].map(tone => (
                  <button
                    key={tone}
                    className={`glow-button outline`}
                    onClick={() => handlePersonalityChange('tone', tone)}
                    style={{
                      flex: 1, height: '45px', fontSize: '0.9rem', textTransform: 'capitalize',
                      background: personality.tone === tone ? 'rgba(176,38,255,0.1)' : 'transparent',
                      borderColor: personality.tone === tone ? 'var(--accent-purple)' : 'var(--border)',
                      color: personality.tone === tone ? '#fff' : 'var(--text-muted)'
                    }}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr style={{ border: 'none', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }} />

        {/* Notifications & Permissions */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-purple), rgba(168, 85, 247, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                🔔
              </div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>Browser Alerts</h3>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontWeight: 500 }}>Push Notifications</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Status: <strong style={{ color: notifications === 'granted' ? '#10b981' : '#f59e0b', letterSpacing: '1px' }}>{notifications.toUpperCase()}</strong></p>
              </div>
              {notifications !== 'granted' && (
                <button className="glow-button" onClick={requestNotification} style={{ padding: '10px 20px', borderRadius: '8px' }}>Allow</button>
              )}
            </div>
          </div>

          {/* About System */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--accent-pink), rgba(236, 72, 153, 0.2))', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>
                ℹ️
              </div>
              <h3 style={{ fontSize: '1.3rem', margin: 0, fontWeight: 600 }}>System Core</h3>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.03)' }}>
              <p style={{ color: 'var(--text-primary)', lineHeight: '1.6', margin: '0 0 1rem 0', fontSize: '0.95rem' }}>
                CJ is a personalized Desktop Assistant built for seamless work and companionship.
                Running on Web Speech API and <strong style={{ color: 'var(--accent-blue)' }}>Groq LLaMA 3 70B</strong>.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                <span>Engine: <strong>Groq Cloud</strong></span>
                <span>Creator: <strong>Jaanvi Chouhan</strong></span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
