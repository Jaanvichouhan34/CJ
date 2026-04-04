require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://cj-backend-59nv.onrender.com',
    ];
    // Allow requests with no origin (mobile, Postman, etc.)
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/api/memory', require('./routes/memory'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`CJ Backend running on port ${PORT}`);
  console.log('Gemini API Key loaded:', !!process.env.GEMINI_API_KEY);
});
