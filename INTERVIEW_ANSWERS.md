# 🤖 CJ - AI Agent Interview Preparation

This document contains the core questions and detailed answers about the **CJ** (Cyber Jarvis) project. Use this to prepare for interviews or to understand the technical depth of the application.

---

## 🔹 Basic / Intro Questions

**Tell me about CJ. What does it do?**
CJ (Cyber Jarvis) is a personal AI Agent designed to bridge the gap between a standard chatbot and a system-level assistant. It handles natural language conversations, manages reminders, and can control system functions like opening apps (Spotify, WhatsApp, VS Code), searching the web, or even locking your PC—all through voice or text.

**Why did you build CJ?**
I wanted to build something more than just a "wrapper" for an LLM. I wanted a companion that actually *understands* my system. CJ was built to automate repetitive desktop tasks and provide a personalized "Friday/Jarvis" style experience that feels alive and useful.

**What makes CJ different from a normal chatbot?**
Normal chatbots just talk; CJ **acts**. Most chatbots are trapped in a browser tab. CJ has "System Hooks"—it can trigger real actions on my computer (opening local apps, system commands) and has a "Memory" system that persists across sessions.

**Is CJ deployed? Show me the live link.**
*(Note: If you have a Vercel/Render link, add it here. If it's a local system agent, explain that it's designed to run locally to have system access).*

**How long did it take you to build CJ?**
The core MVP was built in about a week, with several iterations for the Voice Echo protection and the Groq API migration.

---

## 🔹 Technical — Architecture

**What is your tech stack for CJ?**
*   **Frontend:** React (Vite) with Vanilla CSS for a premium dark-glassmorphism UI.
*   **Backend:** Node.js & Express.
*   **Database:** MongoDB with Mongoose (storing chat history and user preferences).
*   **AI:** Groq API (Llama 3.3 70B) for ultra-fast inference.
*   **Automation:** Node `child_process` for system-level execution.

**Why did you choose MERN stack?**
Node.js is perfect for this because it's non-blocking and has great support for `child_process`, which I needed to control the OS. React allowed me to build a dynamic, "pulsing" UI, and **MongoDB** allows for scalable chat history and user profile management.

**Why Groq over Gemini?**
Speed and Latency. Groq’s LPU (Language Processing Unit) architecture provides near-instant responses (often >200 tokens/sec), which is critical for a voice-activated assistant where any delay feels "laggy."

**How does the frontend communicate with the backend?**
Through a RESTful API. The frontend sends the user message and the selected mode (Friend/Pro) via a POST request to `/api/chat`.

**What is the role of Node.js in CJ?**
Node.js acts as the "Brain's Body." While the LLM provides the "thoughts," Node.js executes the "actions." It parses the intent, checks for command overrides (like "open Chrome"), and communicates with the Windows OS to run commands.

---

## 🔹 Technical — AI / LLM

**Which LLM model does CJ use?**
It uses **Llama-3.3-70b-versatile** hosted on Groq Cloud.

**How do you send messages to the Groq API?**
I use the standard Fetch API in Node.js to send a JSON payload to Groq's OpenAI-compatible endpoint. I pass the `GROQ_API_KEY` in the headers and the conversation history in the `messages` array.

**What is a system prompt? What system prompt did you use in CJ?**
A system prompt defines the "personality" and "rules" for the AI.
*   **Friend Mode:** "You are CJ, casual, warm, uses slang like 'bro' and 'fr fr'."
*   **Pro Mode:** "You are CJ, a professional assistant, precise and helpful."

**How does CJ maintain conversation context?**
Currently, CJ focuses on the current prompt for speed, but the system is designed to accept an array of messages to provide short-term memory during a session.

**What happens when the conversation gets too long? How do you handle token limits?**
I implement a "Sliding Window" strategy. If I were to send full history, I would only send the last 5-10 messages to ensure we stay within the context window and keep costs/latency low.

**What is temperature? What value did you set in CJ and why?**
Temperature controls randomness. I set it to **0.7**. This is the "sweet spot"—it allows CJ to be creative and "human" in Friend mode without becoming nonsensical.

---

## 🔹 Technical — Memory System

**How does CJ remember past conversations?**
It uses a **MERN stack memory system**. Every message is saved to a MongoDB collection. Before sending a new prompt to the AI, CJ fetches the last 10 messages from the database to provide conversation context.

**Where is the memory stored — frontend or backend?**
The backend, inside a MongoDB database. This is more professional and allows the "Agent" to maintain context even if the user switches devices or refreshes the page.

**Does memory persist after the user closes the app?**
Yes. Since it's written to the filesystem on the server (backend), it stays there until explicitly deleted.

**How do you decide how much memory to keep?**
I implement a **Short-Term Context Window** of the last 10 messages for immediate conversation flow, while keeping the full history in the database for long-term reference and potential RAG (Retrieval-Augmented Generation) features later.

---

## 🔹 Technical — Voice & Automation

**How does voice input work in CJ?**
It uses the **Web Speech API** (specifically `webkitSpeechRecognition`). It captures audio in the browser, converts it to text, and sends that text to the AI.

**Which API did you use for voice — browser or external?**
Browser-native Web Speech API. This keeps the app free and fast without needing external cloud credits for STT (Speech-to-Text).

**How does CJ open apps on the system?**
I built a **Command Dispatcher** in the backend. When a message starts with "open" or "launch," Node.js intercepts it and uses `exec()` to run the corresponding system command (e.g., `start chrome` or `code`).

**What happens if CJ doesn't understand a voice command?**
It falls back to the LLM. If it’s not a hard-coded command (like "lock pc"), the text is sent to Llama 3, which then provides a natural language response.

**How did you handle the dual personality mode?**
I used **Conditional Prompting**. Depending on a toggle in the UI, the backend injects a different "Identity" into the system prompt before calling the AI.

---

## 🔹 Agent / Zangoh Specific

**Is CJ an AI agent? Explain why.**
Yes. An "Agent" is defined by having:
1.  **Reasoning:** Provided by Llama 3.
2.  **Tools:** The ability to execute code and control the system (exec commands).
3.  **Memory:** Persistence of user data.
4.  **Goal-Orientation:** It doesn't just chat; it tries to fulfill tasks like setting reminders or opening apps.

**What are the components of an agent? Does CJ have all of them?**
*   **Planning:** CJ handles this via the LLM deciding how to answer.
*   **Memory:** Yes (JSON files).
*   **Tool Use:** Yes (System commands).
*   **Action:** Yes (Executing OS commands).

**How is CJ similar to what Zangoh builds?**
Zangoh builds sophisticated AI Agents that automate workflows. CJ is a "Personal Desktop Version" of that same philosophy—using an LLM as a "reasoning engine" to interact with the world (in this case, my computer).

**If you had to add one feature to CJ to make it production-ready, what would it be?**
**RAG (Retrieval-Augmented Generation).** I would allow CJ to read my local documents or PDFs so I could ask it questions about my own files.

**How would you scale CJ for 1000 users?**
1.  Move from local JSON to **MongoDB Atlas**.
2.  Containerize the backend with **Docker**.
3.  Implement **Redis** for session/context caching.
4.  Use a load balancer (like Nginx) to handle multiple backend instances.

---

## 🔹 Challenges & Learning

**What was the hardest part of building CJ?**
**Echo Cancellation.** When CJ speaks, the mic would hear CJ and think it was the user talking. I had to build a custom event listener (`cj-speech-start`) to "mute" the microphone whenever the AI was talking.

**Did you face any bugs? How did you fix them?**
The "Voice Loop" bug was the biggest. I fixed it by creating a global state `window.isCjSpeaking` and aborting the `SpeechRecognition` instance whenever that state was true.

**What would you do differently if you rebuilt CJ today?**
I would use **Python** for the backend to leverage the `LangChain` or `CrewAI` frameworks, which are more specialized for complex multi-agent workflows.

**What did you learn from building CJ?**
I learned that the real power of AI isn't just in the model's knowledge, but in how you connect that model to **IO (Input/Output)**—making the AI actually *do* things in the physical or digital world.
