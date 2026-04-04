import { useState, useEffect } from 'react';

export default function ReminderPanel() {
  const [reminders, setReminders] = useState([]);
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reminders');
      const data = await res.json();
      setReminders(data);
    } catch(err) {
      console.error(err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!time || !message) return;
    try {
      const res = await fetch('http://localhost:5000/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time, message })
      });
      if(res.ok) {
        setTime('');
        setMessage('');
        setShowForm(false);
        fetchReminders();
      }
    } catch(err) {
      console.error('Error adding reminder', err);
    }
  };

  const handleDelete = async (index) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reminders/${index}`, { method: 'DELETE' });
      if(res.ok) fetchReminders();
    } catch(err) {
      console.error('Error deleting reminder', err);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 5, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>My Reminders ⏰</h2>
        <button className="glow-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close' : '+ Add Reminder'}
        </button>
      </div>
      
      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="glass-card anim-slide-down" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Time (24h)</label>
            <input type="time" className="glow-input" value={time} onChange={(e) => setTime(e.target.value)} required />
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>What should I remind you about?</label>
            <input type="text" className="glow-input" placeholder="e.g. Eat dinner, Drink water" value={message} onChange={(e) => setMessage(e.target.value)} required />
          </div>
          <button type="submit" className="glow-button" style={{ height: '50px' }}>Save ➔</button>
        </form>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {reminders.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <div className="anim-pulse-glow" style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏰</div>
            <p>No reminders yet. Ask CJ to remind you!</p>
          </div>
        ) : (
          reminders.map((r, idx) => (
            <div key={idx} className="glass-card anim-slide-up" style={{ 
              padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderLeft: r.fired ? '4px solid var(--border)' : '4px solid var(--accent-blue)',
              opacity: r.fired ? 0.6 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <strong style={{ fontSize: '1.8rem', color: r.fired ? 'var(--text-muted)' : 'var(--accent-blue)', fontWeight: 'bold' }}>{r.time}</strong>
                <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: r.fired ? 'line-through' : 'none' }}>{r.message}</p>
              </div>
              
              <button 
                onClick={() => handleDelete(idx)}
                className="glow-button outline"
                style={{ padding: '8px 16px', borderColor: 'rgba(236, 72, 153, 0.4)' }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
