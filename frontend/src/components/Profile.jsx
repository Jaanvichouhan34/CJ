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
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem', zIndex: 5, position: 'relative', animation: 'slideUp 0.4s easeOut' }}>
      
      {/* Banner / Header Card */}
      <div className="glass-card" style={{ 
        padding: '3.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center', 
        position: 'relative',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        
        {!isEditing ? (
          <button className="glow-button outline" onClick={() => setIsEditing(true)} style={{ position: 'absolute', top: '2rem', right: '2rem', borderRadius: '30px' }}>
            ✏️ Edit Profile
          </button>
        ) : (
          <button className="glow-button" onClick={handleSave} style={{ position: 'absolute', top: '2rem', right: '2rem', borderRadius: '30px', boxShadow: '0 0 15px var(--accent-blue)' }}>
            💾 Save Changes
          </button>
        )}

        <div className="anim-pulse-glow" style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '4rem', fontWeight: 'bold', color: '#fff', 
          marginBottom: '2rem', boxShadow: '0 10px 25px rgba(168, 85, 247, 0.4)',
          border: '4px solid rgba(255,255,255,0.1)'
        }}>
          {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
        </div>

        {isEditing ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', width: '100%', maxWidth: '700px', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--accent-blue)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Preferred Name</label>
              <input type="text" className="glow-input" style={{ width: '100%', fontSize: '1.05rem', padding: '12px 16px' }} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', color: 'var(--accent-blue)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Age</label>
              <input type="number" className="glow-input" style={{ width: '100%', fontSize: '1.05rem', padding: '12px 16px' }} value={formData.age || ''} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--accent-purple)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>College / University</label>
              <input type="text" className="glow-input" style={{ width: '100%', fontSize: '1.05rem', padding: '12px 16px' }} value={formData.college || ''} onChange={e => setFormData({...formData, college: e.target.value})} />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', color: 'var(--accent-purple)', marginBottom: '0.8rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Work / Focus</label>
              <input type="text" className="glow-input" style={{ width: '100%', fontSize: '1.05rem', padding: '12px 16px' }} value={formData.work || ''} onChange={e => setFormData({...formData, work: e.target.value})} />
            </div>
          </div>
        ) : (
          <div style={{ transform: 'translateY(-10px)' }}>
            <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', letterSpacing: '0.5px' }}>{profile.name || 'User'}</h1>
            <p style={{ color: 'var(--accent-blue)', fontSize: '1.2rem', marginBottom: '3rem', opacity: 0.9 }}>{profile.work || 'Ready to assist'}</p>
            
            <div style={{ display: 'flex', gap: '3.5rem', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '800' }}>{profile.age || '?'}</strong>
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Years Old</span>
              </div>
              <div style={{ width: '1px', background: 'linear-gradient(to bottom, transparent, var(--border), transparent)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <strong style={{ display: 'block', color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: '800' }}>{profile.college || 'None'}</strong>
                <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>College</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-blue)', fontWeight: '800', lineHeight: 1 }}>{daysWithCJ}</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '1rem', fontWeight: 500, letterSpacing: '0.5px' }}>Days with CJ</div>
        </div>
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-purple)', fontWeight: '800', lineHeight: 1 }}>∞</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '1rem', fontWeight: 500, letterSpacing: '0.5px' }}>Total Chats</div>
        </div>
        <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
             onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}>
          <div style={{ fontSize: '3.5rem', color: 'var(--accent-pink)', fontWeight: '800', lineHeight: 1 }}>✓</div>
          <div style={{ color: 'var(--text-muted)', marginTop: '1rem', fontWeight: 500, letterSpacing: '0.5px' }}>Active User</div>
        </div>
      </div>
    </div>
  );
}
