# 🤖 CJ — Your Personal AI Desktop Assistant

> *"Not just an assistant. Your friend."*

CJ is a full-stack AI-powered desktop assistant built with Python, Node.js, and React. It listens to your voice, remembers who you are, controls your computer, and talks to you like a real friend. Think JARVIS — but smarter, more personal, and built by you.

---

## 📌 Table of Contents

1. [What is CJ?](#what-is-cj)
2. [Why We Built This](#why-we-built-this)
3. [Tech Stack — What We Use & Why](#tech-stack)
4. [Project Structure](#project-structure)
5. [Features](#features)
6. [How It All Works Together](#how-it-all-works-together)
7. [Setup & Installation](#setup--installation)
8. [All Commands You Need](#all-commands-you-need)
9. [Environment Variables](#environment-variables)
10. [How to Run CJ](#how-to-run-cj)
11. [API Reference](#api-reference)
12. [Common Errors & Fixes](#common-errors--fixes)
13. [Interview Explanation Guide](#interview-explanation-guide)

---

## What is CJ?

CJ is a **voice-controlled AI desktop assistant** that combines:

- 🧠 **AI Brain** — Powered by Google Gemini API for intelligent conversations
- 🎙️ **Voice Control** — Speak commands, CJ listens and responds
- 💾 **Memory System** — Remembers your name, college, habits, and preferences
- 🖥️ **System Control** — Opens apps, deletes files, transfers to pen drives
- ⏰ **Smart Reminders** — Schedules alerts that fire when your laptop is ON
- 👫 **Friend Mode** — Switches from professional assistant to casual best friend
- 🎨 **Web Dashboard** — Beautiful React UI to chat, manage reminders, and configure settings

---

## Why We Built This

Most JARVIS-clone projects floating around GitHub are just basic voice + command tools. CJ is different because:

| Other JARVIS Clones | CJ |
|---|---|
| No memory of who you are | Remembers your name, age, college, habits |
| Robotic responses | Talks like a real friend in Friend Mode |
| No confirmation for risky actions | 2-way authentication before deleting files or transferring data |
| Single voice only | Choose Male or Female voice |
| No web interface | Full React dashboard with glassmorphism UI |
| No interview prep | Built-in mock interview and quiz mode (coming in Phase 2) |

CJ is designed for **introverts and solo learners** who want a companion that's always there — to help with work AND to just talk.

---

## Tech Stack

### 🐍 Python (Desktop Core)
**Why Python?**
Python is the best language for desktop automation and AI integration. It can control your operating system, speak to you, listen to your voice, and call AI APIs — all with simple libraries.

| Library | What It Does | Why We Chose It |
|---|---|---|
| `pyttsx3` | Converts text to speech (CJ's voice) | Works offline, supports male/female voice selection |
| `SpeechRecognition` | Captures and converts your voice to text | Industry-standard library, easy to use |
| `PyAudio` | Handles microphone input | Required by SpeechRecognition to access the mic |
| `google-generativeai` | Connects to Gemini AI API | Free tier available, powerful responses |
| `schedule` | Runs reminders at set times | Lightweight, perfect for timed tasks |
| `psutil` | Detects USB drives, lists processes | Cross-platform system utilities |
| `shutil` | Copies files to pen drive | Built into Python, reliable file operations |
| `os` + `subprocess` | Opens apps, deletes temp files | Core Python modules for OS interaction |
| `json` | Reads and writes memory/reminders | Simple data storage without a database |

---

### ⚙️ Node.js + Express (Backend API)
**Why Node.js?**
Node.js acts as a bridge between the Python desktop app and the React frontend. It also handles Gemini API calls from the web dashboard side.

| Package | What It Does | Why We Chose It |
|---|---|---|
| `express` | Creates the REST API server | Most popular Node.js framework, simple routing |
| `cors` | Allows React to talk to the backend | Required for cross-origin API requests |
| `dotenv` | Loads secret keys from `.env` file | Keeps API keys out of your code |
| `@google/generative-ai` | Gemini API for the web chat | Same AI model as Python side |
| `nodemon` | Auto-restarts server on file save | Saves time during development |

---

### ⚛️ React + Vite (Frontend Dashboard)
**Why React?**
React makes it easy to build interactive, component-based UIs. Vite makes it fast to set up and run.

| Tool | What It Does | Why We Chose It |
|---|---|---|
| `React` | Builds the UI components | Component-based, fast, industry standard |
| `Vite` | Development server and build tool | Much faster than Create React App |
| `Web Speech API` | Browser-based voice input | Built into browsers, no library needed |
| CSS Variables | Theme management | Easy to change colors globally |
| CSS Keyframes | Animations (hover, glow, slide) | No external library needed, pure CSS |

---

## Setup & Installation

### Prerequisites
Make sure you have these installed on your laptop:
- Python 3.8 or higher
- Node.js 18 or higher
- npm (comes with Node.js)
- A Google Gemini API key (free at https://aistudio.google.com/app/apikey)

### Step 1 — Clone or Download the Project
```bash
git clone https://github.com/Jaanvichouhan34/CJ.git
cd CJ
```

### Step 2 — Set Up Python (Desktop App)
```bash
cd desktop
pip install -r requirements.txt
python main.py
```

### Step 3 — Set Up Backend (Node.js)
```bash
cd backend
npm install
npm run dev
```

### Step 4 — Set Up Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

---

## 👩‍💻 Built By

**Jaanvi Chouhan**
B.Tech CSE — 3rd Year
GitHub: [https://github.com/Jaanvichouhan34](https://github.com/Jaanvichouhan34)
LinkedIn: [https://linkedin.com/in/jaanvi-chouhan](https://linkedin.com/in/jaanvi-chouhan)

*CJ is built for introverts, dreamers, and anyone who wants technology to feel human.*
