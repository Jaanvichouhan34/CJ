export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'reminders', label: 'Reminders', icon: '⏰' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'help', label: 'Help', icon: '🤖' },
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
        <div className="anim-pulse-glow" style={{
          width: '40px', height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontWeight: 'bold', fontSize: '1.2rem', color: '#fff'
        }}>
          CJ
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, letterSpacing: '0.5px' }}>CJ Assistant</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', background: 'rgba(0, 200, 255, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>v1.0</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1 }}>
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '14px 1rem',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)' : 'transparent',
                borderLeft: isActive ? '4px solid transparent' : '4px solid transparent',
                borderImage: isActive ? 'linear-gradient(to bottom, var(--accent-blue), var(--accent-purple)) 1' : 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '0 12px 12px 0',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '1.05rem',
                transition: 'all 0.3s ease',
                transform: isActive ? 'translateX(6px)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.transform = 'translateX(6px)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
              <span style={{ fontWeight: isActive ? '600' : '400' }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Bottom Status */}
      <div style={{ marginTop: 'auto', padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '10px', height: '10px', borderRadius: '50%', background: '#10b981',
          boxShadow: '0 0 10px #10b981'
        }} className="anim-pulse-glow"></div>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Online</span>
      </div>
    </aside>
  );
}
