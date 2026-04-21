import { useState, useEffect, useRef } from 'react'

export default function VoiceButton({ onResult }) {
  const [isListening, setIsListening] = useState(false)
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
        console.error("Speech recognition error", event.error);
      }

      recognition.onend = () => {
        // Only restart if the user still wants us to listen AND CJ isn't talking
        if (isListeningRef.current && !window.isCjSpeaking) {
          try {
            recognition.start();
          } catch(e) {}
        }
      }

      recognitionRef.current = recognition;

      // Robust Echo Loop Protection
      const handleSpeechStart = () => {
        console.log("[Mic] CJ is speaking - aborting recognition to block echo.");
        recognition.abort(); // Use abort to instantly stop any pending results
      };

      const handleSpeechEnd = () => {
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
    <button 
      onClick={toggleListen}
      title={isListening ? "Listening natively... (Click to stop)" : "Click to start hands-free mode"}
      style={{
        width: '45px', height: '45px',
        borderRadius: '50%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'var(--bg-card)',
        border: `2px solid ${isListening ? '#ef4444' : 'var(--border)'}`,
        boxShadow: isListening ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: isListening ? 'pulse-glow-red 2s infinite' : 'none'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>🎙️</span>
    </button>
  )
}
