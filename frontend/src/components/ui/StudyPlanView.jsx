import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, List, ChevronLeft, ChevronRight, Clock, BookOpen } from 'lucide-react';

export default function StudyPlanView({ schedule, subjects }) {
  const [view, setView] = useState('timeline'); // 'timeline' | 'calendar'
  const [weekOffset, setWeekOffset] = useState(0);

  const sortedDates = Object.keys(schedule).sort();
  if (!sortedDates.length) return (
    <div className="glass rounded-2xl p-12 border border-white/10 text-center text-white/30">
      <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
      <p>Generate a study plan first to see your schedule.</p>
    </div>
  );

  // Week navigation
  const startDate = new Date(sortedDates[0]);
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + weekOffset * 7);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  const totalWeeks = Math.ceil(sortedDates.length / 7);

  return (
    <div className="space-y-5">
      {/* View Toggle + Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('timeline')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${view === 'timeline' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/50 hover:text-white/80 glass'}`}
          >
            <List size={14} /> Timeline
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${view === 'calendar' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-white/50 hover:text-white/80 glass'}`}
          >
            <Calendar size={14} /> Calendar
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setWeekOffset(o => o - 1)} disabled={weekOffset === 0}
            className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white disabled:opacity-30 transition-all">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-white/60">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} –{' '}
            {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button onClick={() => setWeekOffset(o => o + 1)}
            className="w-8 h-8 glass rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'timeline' ? (
          <TimelineView key="timeline" weekDates={weekDates} schedule={schedule} />
        ) : (
          <CalendarView key="calendar" weekDates={weekDates} schedule={schedule} />
        )}
      </AnimatePresence>

      {/* Subject Legend */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-4 border border-white/10">
        <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Subject Legend</p>
        <div className="flex flex-wrap gap-3">
          {subjects.map(s => (
            <div key={s.id} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="text-xs text-white/60">{s.name}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function TimelineView({ weekDates, schedule }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="space-y-3"
    >
      {weekDates.map((date, i) => {
        const tasks = schedule[date] || [];
        const totalHours = tasks.reduce((s, t) => s + t.hours, 0);
        const d = new Date(date);
        const isToday = date === new Date().toISOString().split('T')[0];

        return (
          <div key={date} className={`glass rounded-2xl p-4 border transition-all
            ${isToday ? 'border-indigo-500/40 bg-indigo-500/5' : 'border-white/10'}
            ${!tasks.length ? 'opacity-40' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-xs font-bold
                  ${isToday ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                  <span className="text-[10px] leading-none">{days[i]}</span>
                  <span className="text-sm leading-none">{d.getDate()}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">
                    {d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    {isToday && <span className="ml-2 text-xs text-indigo-400 font-normal">Today</span>}
                  </p>
                  {tasks.length > 0 && (
                    <p className="text-xs text-white/40 flex items-center gap-1">
                      <Clock size={10} /> {totalHours.toFixed(1)}h · {tasks.length} session{tasks.length > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {tasks.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tasks.map((task, j) => (
                  <motion.div
                    key={j}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: j * 0.05 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border"
                    style={{
                      backgroundColor: task.color + '15',
                      borderColor: task.color + '30',
                      color: task.color,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: task.color }} />
                    {task.subjectName}
                    <span className="text-white/30">·</span>
                    <span style={{ color: task.color + 'aa' }}>{task.hours}h</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/25 italic">Rest day — no sessions scheduled</p>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}

function CalendarView({ weekDates, schedule }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="grid grid-cols-7 gap-2"
    >
      {days.map((day, i) => (
        <div key={day} className="text-center text-xs text-white/40 font-medium pb-2">
          {day.slice(0, 3)}
        </div>
      ))}
      {weekDates.map((date, i) => {
        const tasks = schedule[date] || [];
        const d = new Date(date);
        const isToday = date === new Date().toISOString().split('T')[0];
        const totalH = tasks.reduce((s, t) => s + t.hours, 0);

        return (
          <div
            key={date}
            className={`min-h-28 rounded-xl p-2 border text-xs transition-all
              ${isToday ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/8 glass'}
              ${!tasks.length ? 'opacity-50' : ''}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold mb-2 text-xs
              ${isToday ? 'bg-indigo-500 text-white' : 'text-white/50'}`}>
              {d.getDate()}
            </div>
            {tasks.length > 0 && (
              <div className="space-y-1">
                {tasks.map((task, j) => (
                  <div
                    key={j}
                    className="px-1.5 py-0.5 rounded-md text-[10px] truncate"
                    style={{ backgroundColor: task.color + '25', color: task.color }}
                  >
                    {task.subjectName.split(' ')[0]} {task.hours}h
                  </div>
                ))}
                <div className="text-white/30 text-[9px] text-center">{totalH.toFixed(1)}h total</div>
              </div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
}
