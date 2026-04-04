import pyttsx3
import speech_recognition as sr

# Initialize the text-to-speech engine
engine = pyttsx3.init()

def set_voice(gender_index):
    """
    Sets the voice gender.
    index 0 = male
    index 1 = female
    """
    try:
        voices = engine.getProperty('voices')
        # Check if the requested index is available
        if gender_index < len(voices):
            engine.setProperty('voice', voices[gender_index].id)
        else:
            print(f"[Voice] Requested voice index {gender_index} not available, using default.")
    except Exception as e:
        print(f"[Voice] Error setting voice: {e}")

def speak(text):
    """
    Speaks the given text out loud and prints it to console.
    """
    try:
        print(f"[CJ says]: {text}")
        engine.say(text)
        engine.runAndWait()
    except Exception as e:
        print(f"[Voice] Error speaking: {e}")

def listen():
    """
    Listens for microphone input and returns the recognized text.
    """
    recognizer = sr.Recognizer()
    with sr.Microphone() as source:
        print("[Voice] Listening...")
        # Adjust for ambient noise
        recognizer.adjust_for_ambient_noise(source, duration=0.5)
        try:
            audio = recognizer.listen(source, timeout=5, phrase_time_limit=10)
            print("[Voice] Processing speech...")
            # Use Google Web Speech API
            text = recognizer.recognize_google(audio)
            print(f"[User said]: {text}")
            return text.lower()
        except sr.WaitTimeoutError:
            print("[Voice] No speech detected within timeout.")
            return ""
        except sr.UnknownValueError:
            print("[Voice] Could not understand the audio.")
            return ""
        except sr.RequestError as e:
            print(f"[Voice] Could not request results from service: {e}")
            return ""
        except Exception as e:
            print(f"[Voice] An unexpected error occurred: {e}")
            return ""
