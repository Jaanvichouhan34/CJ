import os
import json
import time
import datetime
import voice
import brain
import scheduler
import system_control

# Initialize state
current_mode = "assistant"
MEMORY_FILE = os.path.join(os.path.dirname(__file__), 'memory.json')

def load_memory():
    if not os.path.exists(MEMORY_FILE):
        return {}
    try:
        with open(MEMORY_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_memory(memory):
    with open(MEMORY_FILE, 'w') as f:
        json.dump(memory, f, indent=4)

def first_time_setup():
    voice.speak("Hello! I am CJ, your new AI Desktop Assistant.")
    voice.speak("It looks like this is our first time meeting. Let's get to know each other.")
    
    memory = {}
    
    # Name
    voice.speak("What's your name?")
    name = voice.listen()
    memory["name"] = name if name else "User"
    
    # Age
    voice.speak(f"Nice to meet you, {memory['name']}. How old are you?")
    age = voice.listen()
    memory["age"] = age if age else "unknown"
    
    # College
    voice.speak("Which college do you go to?")
    college = voice.listen()
    memory["college"] = college if college else "unknown"
    
    # Work
    voice.speak("What are you currently working on?")
    work = voice.listen()
    memory["work"] = work if work else "unknown"
    
    # Voice preference
    voice.speak("Do you want my voice to be male or female?")
    voice_pref = voice.listen()
    if "female" in voice_pref:
        memory["voice"] = 1
        voice.set_voice(1)
    else:
        memory["voice"] = 0
        voice.set_voice(0)
        
    save_memory(memory)
    voice.speak("Awesome! I've saved everything. We are good to go!")

def greet_user(name):
    hour = datetime.datetime.now().hour
    if 6 <= hour < 12:
        voice.speak(f"Good morning {name}! Ready to crush the day?")
    elif 12 <= hour < 17:
        voice.speak(f"Hey {name}! Hope your afternoon's going well.")
    elif 17 <= hour < 21:
        voice.speak(f"Good evening {name}! How was college today?")
    else:
        voice.speak(f"Hey {name}, it's late. Still grinding?")

def extract_app_name(text):
    words = text.split()
    if "open" in words:
        idx = words.index("open")
        if idx + 1 < len(words):
            return " ".join(words[idx+1:])
    return ""

def chat_loop():
    global current_mode
    while True:
        text = voice.listen()
        if not text:
            continue
            
        print(f"[Input Detected]: {text}")
        
        if "open" in text:
            app_name = extract_app_name(text)
            if app_name:
                res = system_control.open_app(app_name)
                voice.speak(res)
            else:
                voice.speak("What do you want me to open?")
                
        elif "delete temp" in text:
            count = system_control.delete_temp_files()
            voice.speak(f"Deleted {count} temporary files/folders.")
            
        elif "empty recycle bin" in text:
            res = system_control.empty_recycle_bin()
            voice.speak(res)
            
        elif "transfer file" in text:
            # We assume a fixed path for demo, in reality we'd need to extract path
            voice.speak("Which file do you want to transfer? Please provide the full path in text or say cancel.")
            # For this MVP, we prompt but we don't have a reliable way to get long complex paths via STT.
            # So for demonstration:
            voice.speak("File transfer intent detected. Running demo on arbitrary file if available.")
            res = system_control.transfer_to_pendrive("C:\\demo_file.txt")
            voice.speak(res)
            
        elif "remind me" in text:
            voice.speak("What time should I remind you? For example, say 20 00 for 8 PM.")
            time_str = voice.listen()
            # Simple parsing: assume they said something like "14 30"
            clean_time = time_str.replace(" ", ":").strip()
            if not clean_time or len(clean_time) < 4:
                clean_time = "10:00" # Fallback
            voice.speak("And what is the message?")
            message = voice.listen()
            if not message:
                message = "Reminder"
            scheduler.add_reminder(clean_time, message)
            voice.speak(f"Okay, I will remind you: {message} at {clean_time}.")
            
        elif "friend mode" in text:
            current_mode = "friend"
            voice.speak("Switched to friend mode. What's up bro?")
            
        elif "assistant mode" in text:
            current_mode = "assistant"
            voice.speak("Switched to assistant mode. How can I help you?")
            
        elif "bye" in text or "exit" in text or "quit" in text:
            voice.speak("Catch you later! Have a great day.")
            break
            
        else:
            # Send to Gemini
            response = brain.ask_cj(text, mode=current_mode)
            voice.speak(response)

if __name__ == "__main__":
    print("[System] Initializing CJ AI Assistant...")
    
    # Start background scheduler
    scheduler.start()
    
    memory = load_memory()
    if not memory:
        first_time_setup()
        memory = load_memory()
    else:
        gender = memory.get("voice", 0)
        voice.set_voice(gender)
        
    name = memory.get("name", "User")
    greet_user(name)
    
    try:
        chat_loop()
    except KeyboardInterrupt:
        print("\n[System] Exiting CJ AI Assistant.")
