/**
 * Smart Study Scheduler Algorithm
 * Generates an optimized study plan based on:
 * - Subject difficulty (Easy=1, Medium=2, Hard=3)
 * - Exam date proximity (urgency)
 * - Daily available hours
 * - Session length preferences
 *
 * Priority Formula:
 * Priority = (Difficulty Weight × 0.6) + (Exam Urgency Weight × 0.4)
 */

const DIFFICULTY_WEIGHTS = { Easy: 1, Medium: 2, Hard: 3 };

/**
 * Parse uploaded TXT file content into subject objects
 */
export function parseSubjectsFromText(text) {
  const lines = text.trim().split('\n');
  const subjects = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const parts = trimmed.split(',');
    if (parts.length < 4) continue;

    const [name, hours, difficulty, examDate] = parts.map(p => p.trim());

    if (!DIFFICULTY_WEIGHTS[difficulty]) continue;

    subjects.push({
      id: generateId(name),
      name,
      totalHours: parseFloat(hours),
      remainingHours: parseFloat(hours),
      difficulty,
      examDate,
      color: generateSubjectColor(name),
    });
  }

  return subjects;
}

/**
 * Calculate priority score for a subject on a given date
 */
function calcPriorityScore(subject, currentDate) {
  const diffWeight = DIFFICULTY_WEIGHTS[subject.difficulty] || 1;
  const exam = new Date(subject.examDate);
  const now = new Date(currentDate);
  const daysUntilExam = Math.max(1, Math.ceil((exam - now) / (1000 * 60 * 60 * 24)));

  // Urgency: more urgent = higher score (inverse of days)
  // Normalize urgency to 1-3 scale
  const urgencyRaw = Math.min(30, daysUntilExam);
  const urgencyWeight = 3 - ((urgencyRaw - 1) / 29) * 2; // 3 when 1 day, 1 when 30+ days

  const priorityScore = (diffWeight * 0.6) + (urgencyWeight * 0.4);

  return priorityScore;
}

/**
 * Main scheduling function
 */
export function generateStudyPlan(subjects, config) {
  const {
    startDate,
    dailyHours,
    sessionLength,    // hours per session block
    breakDuration,    // minutes between sessions
  } = config;

  if (!subjects.length) return { schedule: {}, warnings: [], stats: {} };

  // Deep clone subjects to avoid mutation
  let remaining = subjects.map(s => ({ ...s, remainingHours: s.totalHours }));
  const schedule = {}; // { 'YYYY-MM-DD': [ { subjectId, subjectName, hours, color } ] }
  const warnings = [];

  // Build date range: start -> max exam date + buffer
  const start = new Date(startDate);
  const maxExam = new Date(Math.max(...subjects.map(s => new Date(s.examDate))));
  const totalDays = Math.ceil((maxExam - start) / (1000 * 60 * 60 * 24)) + 1;

  for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + dayOffset);
    const dateStr = formatDate(currentDate);

    // Filter subjects that still have hours AND exam hasn't passed yet
    const available = remaining.filter(s => {
      const exam = new Date(s.examDate);
      return s.remainingHours > 0 && exam >= currentDate;
    });

    if (!available.length) continue;

    // Sort by priority score (descending)
    available.sort((a, b) => calcPriorityScore(b, currentDate) - calcPriorityScore(a, currentDate));

    let hoursLeftToday = dailyHours;
    const dayTasks = [];

    for (const subject of available) {
      if (hoursLeftToday <= 0) break;
      if (subject.remainingHours <= 0) continue;

      // Don't study a subject after its exam date
      const examDate = new Date(subject.examDate);
      if (currentDate >= examDate) continue;

      // Allocate: up to sessionLength hours per subject per day
      const hoursThisSession = Math.min(
        sessionLength,
        hoursLeftToday,
        subject.remainingHours
      );

      if (hoursThisSession < 0.25) continue; // skip if less than 15 min

      dayTasks.push({
        subjectId: subject.id,
        subjectName: subject.name,
        hours: Math.round(hoursThisSession * 10) / 10,
        difficulty: subject.difficulty,
        color: subject.color,
      });

      // Update remaining hours on the subject in our working array
      const idx = remaining.findIndex(r => r.id === subject.id);
      remaining[idx].remainingHours -= hoursThisSession;
      hoursLeftToday -= hoursThisSession;
    }

    if (dayTasks.length) {
      schedule[dateStr] = dayTasks;
    }
  }

  // Generate warnings for subjects that couldn't be completed
  for (const subject of remaining) {
    if (subject.remainingHours > 0.5) {
      const completed = subject.totalHours - subject.remainingHours;
      const pct = Math.round((completed / subject.totalHours) * 100);
      warnings.push({
        subject: subject.name,
        type: 'incomplete',
        message: `⚠️ ${subject.name} may only reach ${pct}% completion before the exam on ${subject.examDate}. Consider increasing daily hours.`,
        severity: subject.remainingHours > subject.totalHours * 0.5 ? 'high' : 'medium',
      });
    }
  }

  // Stats
  const totalScheduledHours = Object.values(schedule)
    .flat()
    .reduce((sum, t) => sum + t.hours, 0);

  const stats = {
    totalDays: Object.keys(schedule).length,
    totalHours: Math.round(totalScheduledHours * 10) / 10,
    subjectBreakdown: subjects.map(s => {
      const sched = remaining.find(r => r.id === s.id);
      const done = s.totalHours - (sched?.remainingHours || 0);
      return {
        name: s.name,
        scheduled: Math.round(done * 10) / 10,
        total: s.totalHours,
        color: s.color,
        pct: Math.round((done / s.totalHours) * 100),
      };
    }),
  };

  return { schedule, warnings, stats };
}

/**
 * Generate revision recommendations (last 2-3 days before each exam)
 */
export function generateRevisionDays(subjects, schedule) {
  const revisions = [];
  for (const subject of subjects) {
    const exam = new Date(subject.examDate);
    const rev1 = new Date(exam); rev1.setDate(exam.getDate() - 1);
    const rev2 = new Date(exam); rev2.setDate(exam.getDate() - 2);

    revisions.push({
      subject: subject.name,
      color: subject.color,
      examDate: subject.examDate,
      revisionDays: [formatDate(rev2), formatDate(rev1)],
    });
  }
  return revisions;
}

/**
 * Generate focus tips based on subject difficulty
 */
export function generateFocusTips(subjects) {
  const tips = [];
  for (const subject of subjects) {
    if (subject.difficulty === 'Hard') {
      tips.push({
        subject: subject.name,
        color: subject.color,
        tips: [
          `Break ${subject.name} into smaller topics — tackle one concept per session.`,
          `Use active recall (flashcards, practice problems) for ${subject.name}.`,
          `Study ${subject.name} when your energy is highest (morning sessions recommended).`,
          `Teach-back method: explain ${subject.name} concepts out loud to reinforce memory.`,
        ],
      });
    } else if (subject.difficulty === 'Medium') {
      tips.push({
        subject: subject.name,
        color: subject.color,
        tips: [
          `Review ${subject.name} notes within 24 hours of each session for better retention.`,
          `Use mind maps to connect ${subject.name} concepts visually.`,
          `Practice past exam questions for ${subject.name} in the final week.`,
        ],
      });
    } else {
      tips.push({
        subject: subject.name,
        color: subject.color,
        tips: [
          `${subject.name} is manageable — use spaced repetition to lock in key facts.`,
          `Quick daily reviews of ${subject.name} will keep knowledge fresh.`,
        ],
      });
    }
  }
  return tips;
}

/** Utility: format Date to 'YYYY-MM-DD' */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

/** Utility: get week label for a date string */
export function getWeekLabel(dateStr) {
  const d = new Date(dateStr);
  return `Week of ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

/** Utility: deterministic color per subject name */
function generateSubjectColor(name) {
  const colors = [
    '#818cf8', // indigo
    '#a78bfa', // violet
    '#22d3ee', // cyan
    '#34d399', // emerald
    '#fb923c', // orange
    '#f472b6', // pink
    '#facc15', // yellow
    '#60a5fa', // blue
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/** Utility: generate stable ID from name */
function generateId(name) {
  return name.toLowerCase().replace(/\s+/g, '_') + '_' + Math.random().toString(36).slice(2, 6);
}

/** Get weekly workload data for chart */
export function getWeeklyWorkload(schedule) {
  const weekly = {};
  for (const [date, tasks] of Object.entries(schedule)) {
    const d = new Date(date);
    // Get Monday of that week
    const monday = new Date(d);
    monday.setDate(d.getDate() - d.getDay() + 1);
    const weekKey = formatDate(monday);
    const label = monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!weekly[weekKey]) weekly[weekKey] = { week: label, hours: 0, sessions: 0 };
    weekly[weekKey].hours += tasks.reduce((s, t) => s + t.hours, 0);
    weekly[weekKey].sessions += tasks.length;
  }
  return Object.values(weekly).map(w => ({ ...w, hours: Math.round(w.hours * 10) / 10 }));
}

/** Sample dataset */
export const SAMPLE_DATA = `Mathematics,20,Hard,2026-07-10
Physics,15,Medium,2026-07-15
Chemistry,10,Easy,2026-07-20
Computer Science,18,Hard,2026-07-12
English Literature,8,Easy,2026-07-25
Biology,12,Medium,2026-07-18`;
