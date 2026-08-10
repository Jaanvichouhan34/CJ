import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceButton({ onResult }) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef(null)
  const isListeningRef = useRef(false)

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      // continuous = true so it doesn't stop after the first sentence
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        
        // Block text if CJ is actively speaking to prevent echo loops
        if (window.isCjSpeaking) {
          console.log("Ignored audio because CJ is speaking:", transcript);
          return;
        }

        if (transcript) {
          onResult(transcript);
        }
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
          setIsListening(false);
        }
      }

      recognition.onend = () => {
        // Only restart if the user still wants us to listen AND CJ isn't talking
        if (isListeningRef.current && !window.isCjSpeaking) {
          setTimeout(() => {
            if (isListeningRef.current && !window.isCjSpeaking) {
              try {
                recognition.start();
              } catch(e) {
                console.log("Failed to restart recognition:", e);
              }
            }
          }, 300);
        }
      }

      recognitionRef.current = recognition;

      // Robust Echo Loop Protection
      const handleSpeechStart = () => {
        console.log("[Mic] CJ is speaking - aborting recognition to block echo.");
        setIsSpeaking(true);
        recognition.abort(); // Use abort to instantly stop any pending results
      };

      const handleSpeechEnd = () => {
        setIsSpeaking(false);
        // Add a 600ms cooldown after she finishes talking to catch any tail-end audio/echoes
        setTimeout(() => {
          if (isListeningRef.current) {
            console.log("[Mic] CJ finished - resuming recognition.");
            try { recognition.start(); } catch(e) {}
          }
        }, 600);
      };

      window.addEventListener('cj-speech-start', handleSpeechStart);
      window.addEventListener('cj-speech-end', handleSpeechEnd);

      return () => {
        window.removeEventListener('cj-speech-start', handleSpeechStart);
        window.removeEventListener('cj-speech-end', handleSpeechEnd);
        if (recognitionRef.current) recognitionRef.current.stop();
      };
    }
  }, [onResult])

  const toggleListen = () => {
    if (isListening) {
      setIsListening(false);
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      try {
        recognitionRef.current?.start();
      } catch(e){}
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
      {(isListening || isSpeaking) && (
        <div className="waveform-container anim-fade-in">
          <div className="waveform-bar"></div>
          <div className="waveform-bar"></div>
          <div className="waveform-bar"></div>
          <div className="waveform-bar"></div>
          <div className="waveform-bar"></div>
        </div>
      )}
      
      <motion.button 
        onClick={toggleListen}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        title={isListening ? "Listening natively... (Click to stop)" : "Click to start hands-free mode"}
        style={{
          width: '55px', height: '55px',
          borderRadius: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          background: isListening ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)',
          border: `2px solid ${isListening ? '#ef4444' : isSpeaking ? 'var(--accent-blue)' : 'var(--border)'}`,
          boxShadow: isListening 
            ? '0 0 20px rgba(239, 68, 68, 0.5)' 
            : isSpeaking ? '0 0 20px rgba(0, 200, 255, 0.5)' : '0 0 10px rgba(0,240,255,0.1)',
          color: isListening ? '#ef4444' : 'var(--accent-blue)',
          cursor: 'pointer',
          animation: isListening ? 'pulse-glow-red 2s infinite' : isSpeaking ? 'anim-pulse-glow 1.5s infinite' : 'none',
        }}
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </motion.button>
      
      {isListening && (
        <span style={{ 
          fontSize: '0.75rem', 
          color: '#ef4444', 
          fontWeight: '600',
          letterSpacing: '1px',
          textTransform: 'uppercase'
        }} className="anim-fade-in">
          Listening Live
        </span>
      )}
    </div>
  )
}
