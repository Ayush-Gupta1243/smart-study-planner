import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, TrendingUp, AlertTriangle, Lightbulb, CheckCircle } from 'lucide-react';
import StatCard from './StatCard';
import { generateFocusTips, generateRevisionDays } from '../../utils/scheduler';

export default function Dashboard({ subjects, schedule, stats, warnings }) {
  const totalHours = subjects.reduce((s, sub) => s + sub.totalHours, 0);
  const upcomingExams = subjects
    .filter(s => new Date(s.examDate) >= new Date())
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .slice(0, 3);

  const overallProgress = stats?.subjectBreakdown
    ? Math.round(stats.subjectBreakdown.reduce((s, sub) => s + sub.pct, 0) / stats.subjectBreakdown.length)
    : 0;

  const focusTips = generateFocusTips(subjects);
  const revisionDays = generateRevisionDays(subjects, schedule);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Subjects" value={subjects.length} color="indigo" delay={0} />
        <StatCard icon={Clock} label="Total Study Hours" value={`${totalHours}h`} sub="across all subjects" color="violet" delay={0.1} />
        <StatCard icon={Calendar} label="Upcoming Exams" value={upcomingExams.length} sub="in next 30 days" color="cyan" delay={0.2} />
        <StatCard icon={TrendingUp} label="Plan Coverage" value={`${overallProgress}%`} sub="scheduled" color="emerald" delay={0.3} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Exams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={16} className="text-cyan-400" />
            <h3 className="font-semibold text-white/80 text-sm">Upcoming Exams</h3>
          </div>
          <div className="space-y-3">
            {upcomingExams.map(s => {
              const daysLeft = Math.ceil((new Date(s.examDate) - new Date()) / (1000 * 60 * 60 * 24));
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-white/80">{s.name}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${daysLeft <= 5 ? 'text-red-400' : daysLeft <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {daysLeft}d left
                    </div>
                    <div className="text-xs text-white/30">{s.examDate}</div>
                  </div>
                </div>
              );
            })}
            {!upcomingExams.length && (
              <p className="text-white/30 text-sm text-center py-4">No upcoming exams</p>
            )}
          </div>
        </motion.div>

        {/* Subject Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 border border-white/10 lg:col-span-2"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-violet-400" />
            <h3 className="font-semibold text-white/80 text-sm">Subject Coverage</h3>
          </div>
          <div className="space-y-3">
            {(stats?.subjectBreakdown || subjects.map(s => ({ name: s.name, color: s.color, pct: 0, scheduled: 0, total: s.totalHours }))).map(sub => (
              <div key={sub.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sub.color }} />
                    <span className="text-sm text-white/70">{sub.name}</span>
                  </div>
                  <span className="text-xs text-white/40">{sub.scheduled}h / {sub.total}h</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${sub.pct}%` }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Warnings */}
      {warnings?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-400" />
            <h3 className="font-semibold text-amber-300 text-sm">Smart Warnings</h3>
          </div>
          <div className="space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl text-sm
                ${w.severity === 'high' ? 'bg-red-500/10 border border-red-500/20 text-red-300' : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'}`}>
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{w.message}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Focus Tips */}
      {focusTips.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={16} className="text-cyan-400" />
            <h3 className="font-semibold text-white/80 text-sm">AI Focus Suggestions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {focusTips.slice(0, 4).map(tip => (
              <div key={tip.subject} className="p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tip.color }} />
                  <span className="text-sm font-medium text-white/80">{tip.subject}</span>
                </div>
                <ul className="space-y-1.5">
                  {tip.tips.slice(0, 2).map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-white/50">
                      <CheckCircle size={11} className="mt-0.5 text-cyan-500 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Revision Days */}
      {revisionDays.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-2xl p-5 border border-violet-500/20"
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-violet-400" />
            <h3 className="font-semibold text-white/80 text-sm">Recommended Revision Days</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {revisionDays.map(r => (
              <div key={r.subject} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs font-medium text-white/70">{r.subject}</span>
                </div>
                <div className="flex gap-1.5">
                  {r.revisionDays.map(d => (
                    <span key={d} className="text-xs px-2 py-0.5 rounded-lg bg-violet-500/15 text-violet-300 border border-violet-500/20">{d}</span>
                  ))}
                </div>
                <p className="text-xs text-white/30 mt-1.5">Exam: {r.examDate}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
