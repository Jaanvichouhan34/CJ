require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://cj-puce.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

app.use('/api/memory', require('./routes/memory'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CJ Backend running on port ${PORT}`);
  console.log('Gemini API Key loaded:', !!process.env.GEMINI_API_KEY);
});
