import { useState, useEffect } from 'react';
import BASE_URL from '../config.js';

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
      const res = await fetch(`${BASE_URL}/api/reminders`);
      const data = await res.json();
      setReminders(data);
    } catch(err) {
      console.error(err);
    }
  };

  const formatAMPM = (timeStr) => {
    if (!timeStr) return '';
    let [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if(!time || !message) return;
    try {
      const res = await fetch(`${BASE_URL}/api/reminders`, {
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

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/reminders/${id}`, { method: 'DELETE' });
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
          reminders.map((r) => (
            <div key={r._id} className="glass-card anim-slide-up" style={{ 
              padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              borderLeft: r.fired ? '4px solid var(--border)' : '4px solid var(--accent-blue)',
              opacity: r.fired ? 0.6 : 1
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  {r.date && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)', background: 'rgba(168, 85, 247, 0.1)', padding: '2px 8px', borderRadius: '4px', marginBottom: '4px', textTransform: 'uppercase' }}>
                      {new Date(r.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  <strong style={{ fontSize: '1.8rem', color: r.fired ? 'var(--text-muted)' : 'var(--accent-blue)', fontWeight: 'bold' }}>{formatAMPM(r.time)}</strong>
                </div>
                <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', textDecoration: r.fired ? 'line-through' : 'none' }}>{r.message}</p>
              </div>
              
              <button 
                onClick={() => handleDelete(r._id)}
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
