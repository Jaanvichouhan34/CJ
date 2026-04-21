// Voice utility — uses browser's built-in Web Speech API

let voiceGender = 'male'; // default

// Load available voices
export const loadVoices = () => {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        resolve(window.speechSynthesis.getVoices());
      };
    }
  });
};

// Set gender preference
export const setVoiceGender = (gender) => {
  voiceGender = gender;
  localStorage.setItem('cj_voice_gender', gender);
};

export const speak = (text) => {
  return new Promise(async (resolve) => {
    window.isCjSpeaking = true;
    window.dispatchEvent(new CustomEvent('cj-speech-start'));

    window.speechSynthesis.cancel(); // stop any ongoing speech
    const voices = await loadVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    // Allow speed adjustment from localStorage
    const speed = localStorage.getItem('cj_voice_speed') || '1.0';
    utterance.rate = parseFloat(speed);
    utterance.pitch = voiceGender === 'female' ? 1.4 : 0.85;
    utterance.volume = 1;

    // Try to find a matching voice by gender keyword
    const gender = localStorage.getItem('cj_voice_gender') || 'male';
    const femaleKeywords = ['female', 'woman', 'girl', 'zira', 'susan', 'samantha', 'victoria'];
    const maleKeywords = ['male', 'man', 'david', 'mark', 'daniel', 'alex', 'james'];
    const keywords = gender === 'female' ? femaleKeywords : maleKeywords;

    const matched = voices.find(v =>
      keywords.some(k => v.name.toLowerCase().includes(k))
    );
    utterance.voice = matched || voices[0];

    utterance.onend = () => {
      window.isCjSpeaking = false;
      window.dispatchEvent(new CustomEvent('cj-speech-end'));
      resolve();
    };

    utterance.onerror = () => {
      window.isCjSpeaking = false;
      window.dispatchEvent(new CustomEvent('cj-speech-end'));
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
};

// Stop speaking
export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
  window.isCjSpeaking = false;
  window.dispatchEvent(new CustomEvent('cj-speech-end'));
};
