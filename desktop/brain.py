import os
import json
import google.generativeai as genai

# ==========================================
# USER: FILL IN YOUR GEMINI API KEY HERE
GEMINI_API_KEY = "AIzaSyBNBa1kg5CbuZLm08NmqQXaIZg2CBvTN3M"
# ==========================================

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')

MEMORY_FILE = os.path.join(os.path.dirname(__file__), 'memory.json')

# Maintain conversation history for multi-turn context
conversation_history = []

def load_memory():
    """Load user memory configurations."""
    if not os.path.exists(MEMORY_FILE):
        return {}
    try:
        with open(MEMORY_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"[Brain] Error loading memory: {e}")
        return {}

def build_system_prompt(mode):
    """
    Construct the system prompt based on user memory info and requested mode.
    """
    memory = load_memory()
    name = memory.get("name", "User")
    age = memory.get("age", "unknown")
    college = memory.get("college", "unknown")
    work = memory.get("work", "unknown")
    
    base_prompt = f"You are CJ, a highly intelligent AI assistant and the best friend of {name}. " \
                  f"You know they are {age} years old, study at {college}, and are currently working on {work}. "
    
    if mode == "friend":
        personality = "In friend mode: be casual, warm, funny — use phrases like 'ayo', 'bro', 'no way', 'fr fr'. Always address them by name naturally."
    else:
        personality = "In assistant mode: be professional, precise, helpful. Always address them by name naturally."
        
    return base_prompt + personality

def ask_cj(user_input, mode="assistant"):
    """
    Calls the Gemini API to get a response based on the conversation history and system prompt.
    """
    if not GEMINI_API_KEY:
        return "Please set your GEMINI_API_KEY in brain.py."
        
    system_prompt = build_system_prompt(mode)
    
    # We rebuild the history to inject the system instruction as the first user message 
    # (or in a system instruction block if using the full API correctly, but prepending works universally)
    
    # Since gemini-1.5-flash supports system_instruction, we can use it:
    try:
        # Re-initialize the model to set the system instruction dynamically
        configurable_model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_prompt
        )
        
        # We use a chat session to maintain history
        # (Alternatively, we can pass our manual conversation_history list)
        global conversation_history
        chat = configurable_model.start_chat(history=conversation_history)
        
        response = chat.send_message(user_input)
        
        # Update our global history
        conversation_history = chat.history
        
        return response.text
    except Exception as e:
        print(f"[Brain] Error generating response: {e}")
        return "I'm having trouble thinking right now."
