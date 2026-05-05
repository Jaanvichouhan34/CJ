import React from 'react';

export default function Help() {
  return (
    <div style={{ padding: '1rem', maxWidth: '850px', margin: '0 auto', color: 'var(--text-primary)', animation: 'slideUp 0.4s easeOut' }}>
      <h1 style={{ marginBottom: '0.5rem', background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))', WebkitBackgroundClip: 'text', color: 'transparent', fontSize: '2.5rem' }}>
        What can CJ do?
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '1.1rem' }}>
        Your personal assistant is equipped with local system control and advanced AI. Here is everything you can do!
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '25px' }}>
        {/* Generative AI */}
        <div className="glass-card" style={{ padding: '25px', borderRadius: '15px', transition: 'transform 0.3s' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Advanced AI Chat
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            Powered by Groq's LLaMA 3.3 70B for ultra-fast, human-like reasoning and creative responses.
          </p>
        </div>

        {/* Reminders */}
        <div className="glass-card" style={{ padding: '25px', borderRadius: '15px', transition: 'transform 0.3s' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏰</span> Smart Alerts
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            CJ monitors your schedule in the background and speaks reminders out loud when they fire.
          </p>
        </div>

        {/* Hardware Monitor */}
        <div className="glass-card" style={{ padding: '25px', borderRadius: '15px', transition: 'transform 0.3s' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔋</span> System Health
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            CJ can check your battery percentage, RAM usage, and monitor your system's overall health.
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: '3.5rem', marginBottom: '1.5rem', fontSize: '1.6rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        ⚡ System Command Master List
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
        CJ intercepts these triggers to give you instant local control.
      </p>

      <div style={{ background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Command Category</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Voice Triggers</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>Hardware Monitor</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Check battery" • "Memory usage" • "System specs"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px' }}><strong>Display Control</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Set brightness to 80%" • "Dim the screen"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>System Actions</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Lock PC" • "Empty trash" • "What time is it"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px' }}><strong>Web Exploration</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Search for..." • "Google..." • "Open YouTube"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>Software Control</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Open WhatsApp" • "Open Discord" • "Open VS Code"</td>
            </tr>
            <tr>
              <td style={{ padding: '16px 20px' }}><strong>Windows Utilities</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Open Calc" • "Open Notepad" • "Open Settings"</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="glass-card" style={{ marginTop: '3rem', padding: '20px', textAlign: 'center', borderRadius: '12px', borderStyle: 'dashed' }}>
        <p style={{ color: 'var(--accent-purple)', fontWeight: '600' }}>
          💡 Pro Tip: CJ's Voice Button now features a real-time waveform that reacts to your voice!
        </p>
      </div>
    </div>
  );
}
