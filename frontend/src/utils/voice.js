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
    // Adjust pitch and set keywords based on selected persona
    const gender = localStorage.getItem('cj_voice_gender') || 'male';
    let pitch = 1.0;
    let rate = parseFloat(speed);
    let keywords = [];

    if (gender === 'female') {
      pitch = 1.4;
    } else if (gender === 'uk_male') {
      pitch = 0.85;
    } else if (gender === 'uk_female') {
      pitch = 1.3;
    } else if (gender === 'robot') {
      pitch = 0.1;
      rate = rate * 0.8;
    } else if (gender === 'child') {
      pitch = 2.0;
    } else {
      // Default to male
      pitch = 0.85;
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    let matched = null;
    const isFemaleVoice = (v) => {
      const name = v.name.toLowerCase();
      return name.includes('female') || name.includes('woman') || name.includes('girl') || name.includes('zira') || name.includes('samantha') || name.includes('hazel');
    };

    if (gender === 'uk_male') {
      matched = voices.find(v => v.name.includes('UK English Male') || v.name.includes('George') || v.name.includes('Brian'));
      if (!matched) matched = voices.find(v => v.lang.includes('GB') && !isFemaleVoice(v));
      if (!matched) matched = voices.find(v => !isFemaleVoice(v) && v.lang.includes('en'));
    } else if (gender === 'uk_female') {
      matched = voices.find(v => v.name.includes('UK English Female') || v.name.includes('Hazel') || v.name.includes('Amy'));
      if (!matched) matched = voices.find(v => v.lang.includes('GB') && isFemaleVoice(v));
      if (!matched) matched = voices.find(v => isFemaleVoice(v) && v.lang.includes('en'));
    } else if (gender === 'male' || gender === 'robot') {
      matched = voices.find(v => (v.name === 'Google US English' || v.name.includes('David') || v.name.includes('Mark')) && !isFemaleVoice(v));
      if (!matched) matched = voices.find(v => v.lang.includes('US') && !isFemaleVoice(v));
      if (!matched) matched = voices.find(v => !isFemaleVoice(v) && v.lang.includes('en'));
    } else if (gender === 'female' || gender === 'child') {
      matched = voices.find(v => v.name.includes('Zira') || v.name.includes('Samantha') || (v.name === 'Google US English' && isFemaleVoice(v)));
      if (!matched) matched = voices.find(v => v.lang.includes('US') && isFemaleVoice(v));
      if (!matched) matched = voices.find(v => isFemaleVoice(v) && v.lang.includes('en'));
    }
    
    // Ultimate fallback if absolutely no English voice is found (very rare)
    if (!matched) {
      matched = voices.find(v => v.lang.includes('en')) || voices[0];
    }
    
    utterance.voice = matched;

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
