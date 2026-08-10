import { motion } from 'framer-motion';
import { MessageSquare, Bell, User, Settings, HelpCircle, LogOut, Activity } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onSignOut }) {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={20} /> },
    { id: 'reminders', label: 'Reminders', icon: <Bell size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
    { id: 'help', label: 'Help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <aside style={{
      width: '280px',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid var(--border)',
      padding: '2.5rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10
    }}>
      {/* Top Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '3.5rem', paddingLeft: '0.5rem' }}>
        <motion.div 
          className="anim-pulse-glow glitch-text"
          data-text="CJ"
          whileHover={{ scale: 1.1, rotate: 90 }}
          style={{
            width: '45px', height: '45px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontWeight: '900', fontSize: '1.4rem', color: '#fff',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.5)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}>
          CJ
        </motion.div>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Orbitron', fontWeight: '700', margin: 0, letterSpacing: '1px', textShadow: '0 0 10px rgba(0, 240, 255, 0.5)' }}>CYBER</h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--accent-blue)', background: 'rgba(0, 240, 255, 0.1)', padding: '2px 8px', borderRadius: '4px', letterSpacing: '2px', fontFamily: 'Rajdhani' }}>v2099.1</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 8, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              whileTap={{ scale: 0.95 }}
              initial={{ x: 0 }}
              animate={{ 
                x: isActive ? 8 : 0,
                backgroundColor: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                borderColor: isActive ? 'var(--accent-blue)' : 'transparent'
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '14px 1rem',
                border: 'none',
                borderLeft: '4px solid',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '0 12px 12px 0',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '1.1rem',
                fontFamily: 'Rajdhani',
                fontWeight: isActive ? '600' : '500',
                letterSpacing: '1px'
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-blue)' : 'inherit', filter: isActive ? 'drop-shadow(0 0 5px var(--accent-blue))' : 'none' }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom Sign Out */}
      <motion.button 
        onClick={onSignOut}
        whileHover={{ y: -2, backgroundColor: 'rgba(239, 68, 68, 0.15)', boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          marginTop: 'auto',
          padding: '14px 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          color: '#ef4444',
          cursor: 'pointer',
          marginBottom: '2rem',
          fontFamily: 'Rajdhani',
          fontWeight: '600',
          letterSpacing: '1px'
        }}
      >
        <LogOut size={20} />
        <span>SYSTEM LOGOUT</span>
      </motion.button>

      {/* Bottom Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Activity size={16} color="#00f3ff" className="anim-pulse-glow" style={{ filter: 'drop-shadow(0 0 5px #00f3ff)' }} />
        <span style={{ color: 'var(--accent-blue)', fontSize: '0.9rem', fontFamily: 'Rajdhani', letterSpacing: '1px', textShadow: '0 0 5px rgba(0,240,255,0.5)' }}>CORE ONLINE</span>
      </div>
    </aside>
  );
}
