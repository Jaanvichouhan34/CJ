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

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '25px' }}>
        {/* Generative AI */}
        <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border)', transition: 'transform 0.3s', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span> Advanced AI Chat
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            Ask CJ anything. Powered by Groq's LLaMA 3 70B, CJ can write code, brainstorm ideas, answer complex questions, and chat like a best friend.
          </p>
        </div>

        {/* Reminders */}
        <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '15px', border: '1px solid var(--border)', transition: 'transform 0.3s', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <h3 style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⏰</span> Voice Reminders
          </h3>
          <p style={{ color: 'var(--text-muted)', margin: 0, lineHeight: '1.6' }}>
            Go to the Reminders tab to schedule alerts. CJ runs in the background and will literally speak to you out loud when it's time!
          </p>
        </div>
      </div>

      <h2 style={{ marginTop: '3.5rem', marginBottom: '1.5rem', fontSize: '1.6rem', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
        ⚡ System Override Commands
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
        Type or say these exact trigger phrases to skip the AI and have CJ instantly control your PC hardware.
      </p>

      <div style={{ background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Command Category</th>
              <th style={{ padding: '16px 20px', fontWeight: '600' }}>Try Saying...</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>System Controls</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Lock PC" • "Empty Trash" • "What time is it"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px' }}><strong>Web Search</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Search for..." • "Google..."</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>Launch Websites</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Open Netflix" • "Open Gmail" • "Open GitHub"</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px' }}><strong>Open Desktop Apps</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Open Discord" • "Open VS Code" • "Open Chrome"</td>
            </tr>
            <tr>
              <td style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.01)' }}><strong>Windows Utilities</strong></td>
              <td style={{ padding: '16px 20px', color: 'var(--accent-blue)', fontFamily: 'monospace', fontSize: '0.95rem' }}>"Open Calc" • "Open Notepad" • "Open Task Manager"</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
