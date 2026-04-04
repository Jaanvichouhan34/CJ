import { useState, useEffect } from 'react';
import { speak, setVoiceGender } from '../utils/voice';

export default function Settings() {
  const [voiceSettings, setVoiceSettings] = useState({
    gender: localStorage.getItem('cj_voice_gender') || 'male',
    speed: localStorage.getItem('cj_voice_speed') || '1.0'
  });
  
  const [notifications, setNotifications] = useState(Notification.permission);
  
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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 5, position: 'relative' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>System Settings ⚙️</h2>
      
      <div className="glass-card anim-slide-up" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Voice Settings */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-blue)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Voice Preferences</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem' }}>Voice Gender</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className={`glow-button outline ${voiceSettings.gender === 'male' ? 'active' : ''}`}
                  onClick={() => handleVoiceChange('gender', 'male')}
                  style={{ flex: 1, borderColor: voiceSettings.gender === 'male' ? 'var(--accent-blue)' : 'var(--border)' }}
                >Male</button>
                <button 
                  className={`glow-button outline ${voiceSettings.gender === 'female' ? 'active' : ''}`}
                  onClick={() => handleVoiceChange('gender', 'female')}
                  style={{ flex: 1, borderColor: voiceSettings.gender === 'female' ? 'var(--accent-pink)' : 'var(--border)' }}
                >Female</button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '1rem' }}>Speaking Speed</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span>Slow</span>
                <input type="range" min="0.5" max="1.5" step="0.1" 
                  value={voiceSettings.speed} 
                  onChange={(e) => handleVoiceChange('speed', e.target.value)}
                  style={{ flex: 1, accentColor: 'var(--accent-blue)' }} 
                />
                <span>Fast</span>
              </div>
            </div>
          </div>
          
          <button className="glow-button" onClick={testVoice} style={{ marginTop: '1.5rem' }}>
            🔊 Test Voice
          </button>
        </div>

        {/* Notifications */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-purple)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Browser Notifications</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>Status: <strong style={{ color: notifications === 'granted' ? '#10b981' : 'var(--text-primary)' }}>{notifications.toUpperCase()}</strong></p>
            {notifications !== 'granted' && (
              <button className="glow-button outline" onClick={requestNotification}>Request Permission</button>
            )}
          </div>
        </div>

        {/* About */}
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--accent-pink)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>About CJ</h3>
          <p style={{ color: 'var(--text-primary)', lineHeight: '1.6' }}>
            CJ is your personalized AI Desktop Assistant built for seamless work and companionship. 
            It utilizes the Web Speech API and Gemini underneath a React glassmorphism dashboard.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
            <span><strong>Version:</strong> 1.0.0</span>
            <span><strong>Built by:</strong> Jaanvi Chouhan</span>
          </div>
        </div>

      </div>
    </div>
  );
}
