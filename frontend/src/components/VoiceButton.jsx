import { useState, useEffect, useRef } from 'react'

export default function VoiceButton({ onResult }) {
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
        setIsListening(false);
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      }

      recognition.onend = () => {
        setIsListening(false);
      }

      recognitionRef.current = recognition;
    }
  }, [onResult])

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  }

  return (
    <button 
      onClick={toggleListen}
      title={isListening ? "Listening..." : "Click to speak"}
      style={{
        width: '45px', height: '45px',
        borderRadius: '50%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        background: 'var(--glass-bg)',
        border: `1px solid ${isListening ? 'red' : 'var(--border-color)'}`,
        color: 'var(--text-main)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        animation: isListening ? 'pulse-glow 1.5s infinite' : 'none'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>🎙️</span>
    </button>
  )
}
