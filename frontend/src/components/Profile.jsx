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
    } catch (err) {
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
    } catch (err) {
      console.error(err);
    }
  };

  const daysWithCJ = profile.joinDate
    ? Math.floor((new Date() - new Date(profile.joinDate)) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem', zIndex: 5, position: 'relative', animation: 'slideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1)' }}>
      
      {/* Profile Header */}
      <div className="glass-card" style={{
        padding: '4rem 3.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.3) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Animated Background Glow */}
        <div style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle, rgba(0, 200, 255, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>

        {!isEditing ? (
          <button className="glow-button outline" onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '2rem', right: '2rem', borderRadius: '30px', fontSize: '0.85rem' }}>
            ✏️ Edit Profile
          </button>
        ) : (
          <button className="glow-button" onClick={handleSave} style={{ position: 'absolute', top: '2rem', right: '2rem', borderRadius: '30px', fontSize: '0.85rem' }}>
            💾 Save
          </button>
        )}

        <div className="anim-pulse-glow" style={{
          width: '140px', height: '140px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '4.5rem', fontWeight: 'bold', color: '#fff',
          marginBottom: '2rem', boxShadow: '0 15px 35px rgba(0, 200, 255, 0.3)',
          border: '4px solid rgba(255,255,255,0.15)',
          position: 'relative', zIndex: 1
        }}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>

        {isEditing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '700px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', position: 'relative', zIndex: 1 }}>
            <div>
              <label style={{ display: 'block', color: 'var(--accent-blue)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Name</label>
              <input type="text" className="glow-input" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--accent-blue)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Age</label>
              <input type="number" className="glow-input" value={formData.age || ''} onChange={e => setFormData({ ...formData, age: e.target.value })} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--accent-purple)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>High School / College</label>
              <input type="text" className="glow-input" value={formData.college || ''} onChange={e => setFormData({ ...formData, college: e.target.value })} />
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{ fontSize: '3.8rem', margin: '0 0 10px 0', letterSpacing: '-1.5px', fontWeight: '900' }}>{profile.name || 'User'}</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '1.3rem', marginBottom: '3.5rem', fontWeight: '500', opacity: 0.9 }}>{profile.work || 'Operational Status: Ready'}</p>
            
            <div style={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Age</span>
                <strong style={{ fontSize: '1.8rem', fontWeight: '800' }}>{profile.age || '?'}</strong>
              </div>
              <div style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, var(--border), transparent)' }}></div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', display: 'block', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Institution</span>
                <strong style={{ fontSize: '1.8rem', fontWeight: '800' }}>{profile.college || 'Home'}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px' }}>
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-blue)', fontWeight: '900', marginBottom: '0.5rem' }}>{daysWithCJ}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Days Active</div>
        </div>
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-purple)', fontWeight: '900', marginBottom: '0.5rem' }}>{profile.name ? 'Active' : 'Offline'}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>System Status</div>
        </div>
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', transition: 'transform 0.3s ease' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-pink)', fontWeight: '900', marginBottom: '0.5rem' }}>Level 1</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '1px' }}>Access Tier</div>
        </div>
      </div>
    </div>
  );
}

