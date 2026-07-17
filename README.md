..
<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=220&section=header&text=CJ&fontSize=120&fontColor=fff&animation=twinkling&fontAlignY=40&desc=Not%20just%20an%20assistant.%20Your%20friend.&descAlignY=65&descSize=20" />

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-CJ-181717?style=for-the-badge&logo=github)](https://github.com/Jaanvichouhan34/CJ)
[![Backend](https://img.shields.io/badge/⚡_Backend-Live_on_Render-34d399?style=for-the-badge)](https://github.com/Jaanvichouhan34/CJ)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](LICENSE)

<br/>

![Python](https://img.shields.io/badge/Python_3.8+-3776AB?style=flat-square&logo=python&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js_18-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React+Vite-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Gemini](https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=flat-square&logo=google&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

<br/>

```
 ██████╗     ██╗
██╔════╝     ██║
██║          ██║
██║██╗   ██  ██║
╚██████╗  ████╗
 ╚═════╝  ╚═══╝
```

> **Think JARVIS — but smarter, more personal, and actually built by you.**
> CJ listens to your voice, remembers who you are, controls your computer,
> and talks to you like a real friend. Not a tool. A companion.

<br/>

</div>

---

## 🧠 What is CJ?

CJ is a **voice-controlled AI desktop assistant** that goes beyond simple command execution. It's a full-stack system — Python desktop core, Node.js API bridge, and a React glassmorphism dashboard — all connected to Google Gemini AI.

<table>
<tr>
<td width="33%" align="center">
<br/>
🎙️<br/><b>Voice First</b><br/>
<sub>Speak naturally. CJ listens,<br/>understands, and responds.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
💾<br/><b>Persistent Memory</b><br/>
<sub>Remembers your name, college,<br/>habits, and preferences.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
👫<br/><b>Dual Personality</b><br/>
<sub>Professional assistant mode<br/>or casual best friend mode.</sub>
<br/><br/>
</td>
</tr>
<tr>
<td width="33%" align="center">
<br/>
🖥️<br/><b>System Control</b><br/>
<sub>Opens apps, deletes files,<br/>transfers to pen drives.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
⏰<br/><b>Smart Reminders</b><br/>
<sub>Schedules alerts that fire<br/>when your laptop is ON.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
🎨<br/><b>Web Dashboard</b><br/>
<sub>Beautiful React UI with<br/>glassmorphism aesthetics.</sub>
<br/><br/>
</td>
</tr>
</table>

---

## ⚔️ CJ vs Every Other JARVIS Clone

| Feature | Other JARVIS Clones | **CJ** |
|---------|-------------------|--------|
| Identity awareness | ❌ No memory of who you are | ✅ Remembers name, age, college, habits |
| Conversation style | ❌ Robotic, scripted responses | ✅ Talks like a real friend in Friend Mode |
| Risky actions | ❌ Executes without asking | ✅ 2-way auth before deleting / transferring |
| Voice options | ❌ Single voice only | ✅ Male or Female voice selection |
| UI | ❌ Terminal only | ✅ Full React dashboard, glassmorphism design |
| Personality | ❌ Always formal | ✅ Switch between Professional & Friend mode |

> CJ is designed for **introverts and solo learners** who want a companion that's always there — to help with work AND to just talk.

---

## 🛠️ Tech Stack

### 🐍 Python — Desktop Core

> Python is the backbone. It controls your OS, speaks to you, listens to your voice, and calls AI APIs.

| Library | Role |
|---------|------|
| `pyttsx3` | Text-to-speech — CJ's voice (offline, male/female) |
| `SpeechRecognition` | Converts your voice to text |
| `PyAudio` | Microphone input handler |
| `google-generativeai` | Gemini 2.0 Flash AI brain |
| `schedule` | Timed reminders engine |
| `psutil` | USB detection, process listing |
| `shutil` | File transfers to pen drive |
| `os` + `subprocess` | App launcher, file deletion |
| `json` | Memory & reminder persistence (no DB needed) |

### ⚙️ Node.js + Express — API Bridge

> Acts as the bridge between Python desktop and the React frontend. Also handles Gemini calls from the web side.

| Package | Role |
|---------|------|
| `express` | REST API server |
| `cors` | Enables React ↔ Backend communication |
| `dotenv` | Secure API key management |
| `@google/generative-ai` | Gemini API for web dashboard chat |
| `nodemon` | Auto-restart on file save |

### ⚛️ React + Vite — Web Dashboard

> Fast, component-based UI. Pure CSS for animations — no bloat.

| Tool | Role |
|------|------|
| `React` | Component-based UI |
| `Vite` | Lightning-fast dev server |
| `Web Speech API` | Browser-native voice input |
| CSS Variables | Global theme management |
| CSS Keyframes | Glow, hover, slide animations |

---

## 🏗️ Project Structure

```
CJ/
├── desktop/                   # 🐍 Python desktop core
│   ├── main.py                # Entry point — voice loop
│   ├── brain.py               # Gemini AI integration
│   ├── memory.py              # JSON-based memory system
│   ├── reminders.py           # Scheduler engine
│   ├── system_control.py      # OS automation
│   └── requirements.txt
│
├── backend/                   # ⚙️ Node.js + Express API
│   ├── server.js              # Main server
│   ├── routes/                # API route handlers
│   └── .env                   # API keys (gitignored)
│
├── frontend/                  # ⚛️ React + Vite dashboard
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Dashboard views
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Python `3.8+`
- Node.js `18+`
- Google Gemini API key → [Get it free here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/Jaanvichouhan34/CJ.git
cd CJ
```

### 2. Python Desktop Core

```bash
cd desktop
pip install -r requirements.txt
python main.py
```

### 3. Node.js Backend

```bash
cd backend
npm install
```

Create `.env` in `backend/`:

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=5000
```

```bash
npm run dev
```

### 4. React Frontend

```bash
cd frontend
npm install
npm run dev
```

> Open `http://localhost:5173` — your CJ dashboard is live.

---

## 🔐 Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `GEMINI_API_KEY` | `backend/.env` | Google Gemini API key |
| `PORT` | `backend/.env` | Backend server port (default: 5000) |

---

## 💬 How CJ Thinks

```
You speak
    ↓
SpeechRecognition captures audio
    ↓
Text sent to Gemini 2.0 Flash
    ↓
Memory context injected into prompt
    ↓
Response generated
    ↓
pyttsx3 speaks the reply
    ↓
Action executed (if system command)
```

---

## 🎤 Example Commands

```
"Hey CJ, open VS Code"
"Remind me to submit assignment at 6 PM"
"Switch to friend mode"
"Transfer my project files to pen drive"
"What's my name?" → CJ remembers
"Just talk to me" → Friend mode activates
```

---

## 👩‍💻 Built By

<div align="center">

**Jaanvi Chouhan**
*B.Tech CSE · 3rd Year · Medi-Caps University, Indore*

[![GitHub](https://img.shields.io/badge/GitHub-Jaanvichouhan34-181717?style=flat-square&logo=github)](https://github.com/Jaanvichouhan34)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jaanvi--chouhan-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jaanvi-chouhan)
[![Email](https://img.shields.io/badge/Email-jaanvichouhan18805@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:jaanvichouhan18805@gmail.com)

*CJ is built for introverts, dreamers, and anyone who wants technology to feel human.*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer" />

*If CJ feels like a friend — give the repo a ⭐*

</div>
