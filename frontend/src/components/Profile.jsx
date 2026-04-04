import { useState, useEffect } from 'react';
import BASE_URL from '../config.js';

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/memory`);
      const data = await res.json();
      setProfile(data);
      setFormData(data);
    } catch(err) {
        console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      await fetch(`${BASE_URL}/api/memory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setProfile(formData);
      setIsEditing(false);
    } catch(err) {
      console.error(err);
    }
  };

  const daysWithCJ = profile.joinDate 
    ? Math.floor((new Date() - new Date(profile.joinDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 5, position: 'relative' }}>
      
      <div className="glass-card anim-slide-up" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}>
        
        {!isEditing ? (
          <button className="glow-button outline" onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            Edit Profile
          </button>
        ) : (
          <button className="glow-button" onClick={handleSave} style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            Save Changes
          </button>
        )}

        <div className="anim-pulse-glow" style={{
          width: '100px', height: '100px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '3rem', fontWeight: 'bold', color: '#fff', marginBottom: '2rem'
        }}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>

        {isEditing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', maxWidth: '600px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" className="glow-input" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Age</label>
              <input type="number" className="glow-input" value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>College</label>
              <input type="text" className="glow-input" value={formData.college || ''} onChange={e => setFormData({...formData, college: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Current Work</label>
              <input type="text" className="glow-input" value={formData.work || ''} onChange={e => setFormData({...formData, work: e.target.value})} />
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{profile.name || 'User'}</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginBottom: '2rem' }}>{profile.work || 'No work set'}</p>
            
            <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{profile.age || '?'}</strong>
                Years Old
              </div>
              <div style={{ borderLeft: '1px solid var(--border)' }}></div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.5rem' }}>{profile.college || 'None'}</strong>
                College
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card anim-slide-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.1s' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent-blue)', fontWeight: 'bold' }}>{daysWithCJ}</div>
          <div style={{ color: 'var(--text-muted)' }}>Days with CJ</div>
        </div>
        <div className="glass-card anim-slide-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.2s' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent-purple)', fontWeight: 'bold' }}>∞</div>
          <div style={{ color: 'var(--text-muted)' }}>Total Conversations</div>
        </div>
        <div className="glass-card anim-slide-up" style={{ padding: '2rem', textAlign: 'center', animationDelay: '0.3s' }}>
          <div style={{ fontSize: '2.5rem', color: 'var(--accent-pink)', fontWeight: 'bold' }}>✓</div>
          <div style={{ color: 'var(--text-muted)' }}>Reminders Set</div>
        </div>
      </div>
    </div>
  );
}
