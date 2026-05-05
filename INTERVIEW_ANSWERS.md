# 🤖 CJ - AI Agent Interview Preparation

This document contains the core questions and detailed answers about the **CJ** (Cyber Jarvis) project. Use this to prepare for interviews or to understand the technical depth of the application.

---

## 🔹 Basic / Intro Questions

**Tell me about CJ. What does it do?**
CJ (Cyber Jarvis) is a personal AI Agent designed to bridge the gap between a standard chatbot and a system-level assistant. It handles natural language conversations, manages reminders, and can control system functions like opening apps (Spotify, WhatsApp, VS Code), searching the web, monitoring system health (RAM/Battery), adjusting brightness, or even locking your PC—all through voice or text.

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

**How does CJ check your system health (RAM/Battery)?**
I use the `child_process` module in Node.js to run native Windows commands. 
*   For **Battery**, I run `WMIC Path Win32_Battery Get EstimatedChargeRemaining`.
*   For **RAM**, I use a PowerShell command (`Get-CimInstance Win32_OperatingSystem`) to calculate total vs. free memory.
This allows CJ to act like a real system administrator.

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

## 🔹 Technical — Frontend & UX

**How do you handle state in React?**
I use `useState` for things that change on the screen (like the message list) and `useEffect` to trigger actions automatically (like checking for reminders every 30 seconds).

**How does the auto-scroll work in the chat?**
I use a `useRef` hook at the bottom of the chat window. Every time a new message is added, I tell React to "scroll to that ref" so the user always sees the latest reply.

**What is the "Typing Indicator"?**
It's a visual cue (`isTyping` state) that shows three pulsing dots while we wait for the Groq API. This makes the app feel "alive" and tells the user that the AI is thinking.

---

## 🔹 Technical — Networking & Security

**What is CORS and why did you need it?**
CORS stands for "Cross-Origin Resource Sharing." By default, browsers block websites (Vercel) from talking to different servers (Render). I had to enable CORS in the Node.js backend to allow my Frontend to send requests to my Backend.

**How do you keep your API Keys safe?**
I use a `.env` file. I **never** push this file to GitHub. Instead, I manually add the keys into the Vercel and Render dashboards. This prevents hackers from stealing my Groq or MongoDB credentials.

**What happens if the Groq API is down?**
I have an "Error Catch" block in my code. If the API fails, CJ will say: *"Sorry, I'm taking a breather! Please try again later."* instead of the app just crashing.

---

## 🔹 Deployment & DevOps

**Why use Vercel for Frontend and Render for Backend?**
Vercel is the fastest and best at hosting React apps (Frontend). Render is great for running Node.js servers (Backend) for free. Using both shows I can manage a "Distributed Architecture."

**What is a "Cold Start" on Render?**
On the free tier, Render puts the server to sleep after 15 minutes of inactivity. The first time you use it, it takes 40 seconds to "wake up." This is a limitation of free hosting, but the code itself is very fast.

**How do you update the live app?**
I use **CI/CD (Continuous Integration/Deployment)**. When I push code to GitHub, Vercel and Render automatically see the change and update the live website within minutes.

---

## 🚀 CJ Capability Cheat Sheet (Master List)

Use this section to quickly explain **exactly** what CJ can do.

### **1. AI & Reasoning (The Brain)**
*   **Conversational Intelligence:** Powered by Llama 3.3 (70B) for instant, context-aware chatting.
*   **Personality Modes:** Toggle between "Friend Mode" (casual) and "Pro Mode" (professional).
*   **Context Memory:** Remembers the last 8-10 messages to maintain a natural conversation flow.

### **2. Hardware & System Health (New!)**
*   **Battery Status:** Say *"Check my battery"* to get real-time percentage.
*   **RAM Usage:** Say *"How much memory am I using?"* to see free vs. total RAM (GB).
*   **Display Control:** Say *"Set brightness to 50%"* to dim or brighten your screen.
*   **System Health:** Ask *"How is my PC health?"* for a quick specs report.

### **3. Desktop Automation**
*   **Open Apps:** Launch WhatsApp, Discord, Spotify, VS Code, Chrome, and more.
*   **Windows Utilities:** Open Calculator, Notepad, Task Manager, or Settings.
*   **Power Actions:** Say *"Lock my PC"* or *"Empty Recycle Bin"* for instant action.

### **4. Web & Search**
*   **Dynamic Search:** Say *"Search for [Topic]"* or *"Google [Question]"*.
*   **Quick Links:** Instantly open YouTube, Netflix, Gmail, GitHub, or Instagram.

### **5. Voice & UX**
*   **Interactive Waveform:** A visual audio wave that pulses when CJ listens or speaks.
*   **Smart Reminders:** Set alarms like *"Remind me to [Task] at [Time]"*; CJ will speak the reminder out loud even if the app is in the background.

---
