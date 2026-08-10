require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cj_assistant';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/api/memory', require('./routes/memory'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/chat', require('./routes/chat'));

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`CJ Backend running on port ${PORT}`);
  console.log('Groq API Key loaded:', !!process.env.GROQ_API_KEY);
});
