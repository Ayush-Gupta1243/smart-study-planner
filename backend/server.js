/**
 * Smart Study Planner AI - Express Backend
 * Handles file uploads, scheduling API, and data persistence
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Multer (in-memory file upload) ───────────────────────────────────────────
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.txt') {
      return cb(new Error('Only .txt files are allowed'));
    }
    cb(null, true);
  },
});

// ─── Scheduler Logic (server-side mirror) ─────────────────────────────────────
const DIFFICULTY_WEIGHTS = { Easy: 1, Medium: 2, Hard: 3 };

function parseSubjects(text) {
  return text.trim().split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const [name, hours, difficulty, examDate] = line.split(',').map(s => s.trim());
      if (!name || !hours || !DIFFICULTY_WEIGHTS[difficulty] || !examDate) return null;
      return { name, totalHours: parseFloat(hours), difficulty, examDate };
    })
    .filter(Boolean);
}

function calcPriority(subject, currentDate) {
  const diffWeight = DIFFICULTY_WEIGHTS[subject.difficulty];
  const daysLeft = Math.max(1, Math.ceil((new Date(subject.examDate) - new Date(currentDate)) / 86400000));
  const urgency = 3 - ((Math.min(30, daysLeft) - 1) / 29) * 2;
  return (diffWeight * 0.6) + (urgency * 0.4);
}

function generateSchedule(subjects, config) {
  const { startDate, dailyHours, sessionLength } = config;
  let remaining = subjects.map(s => ({ ...s, remainingHours: s.totalHours }));
  const schedule = {};

  const start = new Date(startDate);
  const maxExam = new Date(Math.max(...subjects.map(s => new Date(s.examDate))));
  const totalDays = Math.ceil((maxExam - start) / 86400000) + 1;

  for (let d = 0; d < totalDays; d++) {
    const current = new Date(start);
    current.setDate(start.getDate() + d);
    const dateStr = current.toISOString().split('T')[0];

    const available = remaining
      .filter(s => s.remainingHours > 0 && new Date(s.examDate) >= current)
      .sort((a, b) => calcPriority(b, current) - calcPriority(a, current));

    let left = dailyHours;
    const tasks = [];

    for (const sub of available) {
      if (left <= 0) break;
      const hrs = Math.min(sessionLength, left, sub.remainingHours);
      if (hrs < 0.25) continue;
      tasks.push({ subjectName: sub.name, hours: Math.round(hrs * 10) / 10, difficulty: sub.difficulty });
      const idx = remaining.findIndex(r => r.name === sub.name);
      remaining[idx].remainingHours -= hrs;
      left -= hrs;
    }

    if (tasks.length) schedule[dateStr] = tasks;
  }

  const warnings = remaining
    .filter(s => s.remainingHours > 0.5)
    .map(s => ({
      subject: s.name,
      message: `${s.name} may not complete before exam on ${s.examDate}`,
    }));

  return { schedule, warnings };
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', timestamp: new Date().toISOString() });
});

// Upload + parse subject file
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const content = req.file.buffer.toString('utf-8');
    const subjects = parseSubjects(content);
    if (!subjects.length) return res.status(422).json({ error: 'No valid subjects found in file' });
    res.json({ subjects, count: subjects.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Generate study plan
app.post('/api/generate', (req, res) => {
  try {
    const { subjects, config } = req.body;
    if (!subjects?.length) return res.status(400).json({ error: 'No subjects provided' });
    if (!config?.startDate || !config?.dailyHours) {
      return res.status(400).json({ error: 'Missing config: startDate or dailyHours' });
    }
    const result = generateSchedule(subjects, config);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sample data endpoint
app.get('/api/sample', (req, res) => {
  res.json({
    sample: [
      { name: 'Mathematics', totalHours: 20, difficulty: 'Hard', examDate: '2026-07-10' },
      { name: 'Physics', totalHours: 15, difficulty: 'Medium', examDate: '2026-07-15' },
      { name: 'Chemistry', totalHours: 10, difficulty: 'Easy', examDate: '2026-07-20' },
      { name: 'Computer Science', totalHours: 18, difficulty: 'Hard', examDate: '2026-07-12' },
      { name: 'English Literature', totalHours: 8, difficulty: 'Easy', examDate: '2026-07-25' },
      { name: 'Biology', totalHours: 12, difficulty: 'Medium', examDate: '2026-07-18' },
    ],
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Smart Study Planner API running at http://localhost:${PORT}`);
});

module.exports = app;
