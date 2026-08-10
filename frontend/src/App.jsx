import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ReminderPanel from './components/ReminderPanel';
import SetupModal from './components/SetupModal';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Help from './components/Help';
import { speak } from './utils/voice';
import BASE_URL from './config.js';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('cj_theme') || 'default');

  useEffect(() => {
    localStorage.setItem('cj_theme', theme);
  }, [theme]);

  // Initial setup check
  useEffect(() => {
    fetch(`${BASE_URL}/api/memory`)
      .then(res => res.json())
      .then(data => {
        if (!data || Object.keys(data).length === 0) {
          setShowSetup(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching memory:', err);
        setLoading(false);
      });
  }, []);

  // Global Reminder Background Checker
  useEffect(() => {
    const checkReminders = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/reminders`);
        const reminders = await res.json();
        
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const currentDate = now.toISOString().split('T')[0];

        for (let index = 0; index < reminders.length; index++) {
          const reminder = reminders[index];
          
          const timeMatches = reminder.time === currentTime;
          const dateMatches = !reminder.date || reminder.date === currentDate;

          if (timeMatches && dateMatches && !reminder.fired) {
            // Speak the reminder out loud twice
            await speak(`Hey! Reminder: ${reminder.message}`);
            await speak(`I repeat, ${reminder.message}`);
            
            // Show browser notification
            if (Notification.permission === 'granted') {
              new Notification('CJ Reminder 🔔', { body: reminder.message });
            }
            
            // Mark as fired
            await fetch(`${BASE_URL}/api/reminders/${reminder._id}/fire`, { method: 'POST' });
          }
        }
      } catch (e) {
        console.error("Failed to check reminders in background:", e);
      }
    };

    // Request notification permission on mount
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 30000);
    checkReminders(); // run immediately on mount
    
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    if (window.confirm("Are you sure you want to sign out? This will clear all memory and chat history.")) {
      try {
        await fetch(`${BASE_URL}/api/memory`, { method: 'DELETE' });
        setShowSetup(true);
        setActiveTab('chat');
        window.location.reload(); // Refresh to clear local state
      } catch (e) {
        alert("Failed to sign out");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
        <div className="anim-pulse-glow" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading CJ...</p>
      </div>
    );
  }

  return (
    <div className={theme !== 'default' ? `theme-${theme}` : ''} style={{ display: 'flex', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* 2099 Background Ambient Effects */}
      <div className="ambient-glow-1"></div>
      <div className="ambient-glow-2"></div>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={handleSignOut} />
      
      <main style={{ flex: 1, padding: '2rem 3rem', display: 'flex', flexDirection: 'column', zIndex: 1, height: '100%', overflow: 'hidden' }}>
        {/* HUD Data Panel Wrap */}
        <div className="hud-panel glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '15px', overflow: 'hidden', padding: '1rem' }}>
          <div style={{ display: activeTab === 'chat' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <ChatWindow />
          </div>
          <div style={{ display: activeTab === 'reminders' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <ReminderPanel />
          </div>
          <div style={{ display: activeTab === 'profile' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Profile />
          </div>
          <div style={{ display: activeTab === 'settings' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Settings theme={theme} setTheme={setTheme} />
          </div>
          <div style={{ display: activeTab === 'help' ? 'flex' : 'none', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            <Help />
          </div>
        </div>
      </main>

      {showSetup && <SetupModal onComplete={() => setShowSetup(false)} />}
    </div>
  );
}

export default App;
