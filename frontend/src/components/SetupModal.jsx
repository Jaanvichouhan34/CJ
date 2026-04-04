import { useState, useEffect } from 'react';
import { speak, setVoiceGender } from '../utils/voice';

export default function SetupModal({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    college: '',
    work: '',
    voice: 0
  });

  // Speak questions when step changes
  useEffect(() => {
    switch (step) {
      case 1:
        speak("Hey! I'm CJ. What's your name?");
        break;
      case 2:
        speak("Nice to meet you! How old are you?");
        break;
      case 3:
        speak("Cool! Which college do you go to?");
        break;
      case 4:
        speak("Awesome! What are you currently working on?");
        break;
      case 5:
        speak("Last question — do you prefer a male or female voice?");
        break;
      default:
        break;
    }
  }, [step]);

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      // Final submit
      const payload = {
        ...formData,
        joinDate: new Date().toISOString()
      };
      
      try {
        await fetch('http://localhost:5000/api/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        speak("Perfect! I'm CJ, and I'm ready to be your assistant. Let's go!");
        onComplete();
      } catch (err) {
        console.error("Setup failed", err);
      }
    }
  };

  return (
    <div className="anim-fade-in" style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'linear-gradient(135deg, rgba(5,5,15,0.9), rgba(13,13,26,0.95))',
      backdropFilter: 'blur(20px)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="glass-card anim-slide-up" style={{
        width: '500px', padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Progress Bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, height: '6px',
          background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
          width: `${(step / 5) * 100}%`, transition: 'width 0.4s ease'
        }}></div>

        {/* Logo at top */}
        <div className="anim-pulse-glow" style={{
          width: '70px', height: '70px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '1.8rem', fontWeight: 'bold', margin: '0 auto 2rem auto', color: '#fff'
        }}>
          CJ
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Step {step} of 5
        </p>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', minHeight: '180px' }}>
          {step === 1 && (
            <div className="anim-slide-in-right" key="s1">
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center' }}>What's your name?</h3>
              <input type="text" className="glow-input" autoFocus
                value={formData.name} onChange={e => updateData('name', e.target.value)} required />
            </div>
          )}
          {step === 2 && (
            <div className="anim-slide-in-right" key="s2">
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center' }}>How old are you?</h3>
              <input type="number" className="glow-input" autoFocus
                value={formData.age} onChange={e => updateData('age', e.target.value)} required />
            </div>
          )}
          {step === 3 && (
            <div className="anim-slide-in-right" key="s3">
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center' }}>Which college do you go to?</h3>
              <input type="text" className="glow-input" autoFocus
                value={formData.college} onChange={e => updateData('college', e.target.value)} required />
            </div>
          )}
          {step === 4 && (
            <div className="anim-slide-in-right" key="s4">
              <h3 style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign: 'center' }}>What are you working on?</h3>
              <input type="text" className="glow-input" autoFocus
                value={formData.work} onChange={e => updateData('work', e.target.value)} required />
            </div>
          )}
          {step === 5 && (
            <div className="anim-slide-in-right" key="s5">
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', textAlign: 'center' }}>Choose CJ's voice</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div onClick={() => { updateData('voice', 0); setVoiceGender('male'); }} 
                     className={`glass-card ${formData.voice === 0 ? 'active' : ''}`}
                     style={{ flex: 1, padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer',
                              border: formData.voice === 0 ? '2px solid var(--accent-blue)' : '1px solid var(--border)' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>👨</span>
                  <strong>Male</strong>
                </div>
                <div onClick={() => { updateData('voice', 1); setVoiceGender('female'); }} 
                     className={`glass-card ${formData.voice === 1 ? 'active' : ''}`}
                     style={{ flex: 1, padding: '2rem 1rem', textAlign: 'center', cursor: 'pointer',
                              border: formData.voice === 1 ? '2px solid var(--accent-pink)' : '1px solid var(--border)' }}>
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>👩</span>
                  <strong>Female</strong>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="glow-button" style={{ marginTop: 'auto', padding: '16px' }}>
            {step === 5 ? 'Get Started' : 'Continue ➔'}
          </button>
        </form>
      </div>
    </div>
  );
}
