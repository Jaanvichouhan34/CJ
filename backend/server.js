require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // Allow localhost and ANY vercel.app deployment
    if (
      !origin ||
      origin.includes('vercel.app') ||
      origin.includes('localhost')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
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
