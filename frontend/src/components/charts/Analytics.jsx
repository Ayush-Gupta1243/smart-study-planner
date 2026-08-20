import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Legend,
} from 'recharts';
import { getWeeklyWorkload } from '../../utils/scheduler';
import { BarChart2, PieChart as PieIcon, TrendingUp } from 'lucide-react';

const tooltipStyle = {
  backgroundColor: '#1a1830',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '12px',
  color: '#e8e8e8',
  fontSize: '12px',
};

export default function Analytics({ subjects, schedule, stats }) {
  const weeklyData = getWeeklyWorkload(schedule);

  // Pie chart data
  const pieData = stats?.subjectBreakdown?.map(s => ({
    name: s.name,
    value: s.scheduled,
    color: s.color,
  })) || [];

  // Bar chart data (total hours per subject)
  const barData = subjects.map(s => ({
    name: s.name.length > 10 ? s.name.slice(0, 10) + '…' : s.name,
    Total: s.totalHours,
    Scheduled: stats?.subjectBreakdown?.find(b => b.name === s.name)?.scheduled || 0,
    color: s.color,
  }));

  return (
    <div className="space-y-6">
      {/* Row 1: Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <PieIcon size={16} className="text-indigo-400" />
            <h3 className="font-semibold text-white/80 text-sm">Subject Hour Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}h`, 'Scheduled']}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
            {pieData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <BarChart2 size={16} className="text-violet-400" />
            <h3 className="font-semibold text-white/80 text-sm">Planned vs Scheduled Hours</h3>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="Total" fill="rgba(99,102,241,0.3)" radius={[4, 4, 0, 0]} name="Total Hours" />
              <Bar dataKey="Scheduled" fill="#6366f1" radius={[4, 4, 0, 0]} name="Scheduled" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weekly Workload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-white/80 text-sm">Weekly Study Workload</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
            <Line type="monotone" dataKey="hours" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4 }} name="Study Hours" />
            <Line type="monotone" dataKey="sessions" stroke="#22d3ee" strokeWidth={2} dot={{ fill: '#22d3ee', r: 3 }} name="Sessions" strokeDasharray="5 3" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Progress Cards per subject */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-5 border border-white/10"
      >
        <h3 className="font-semibold text-white/80 text-sm mb-4">Completion Forecast</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stats?.subjectBreakdown || []).map(sub => (
            <div key={sub.name} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                  <span className="text-sm text-white/70 font-medium">{sub.name}</span>
                </div>
                <span className="text-lg font-bold" style={{ color: sub.color }}>{sub.pct}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sub.pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: sub.color }}
                />
              </div>
              <p className="text-xs text-white/30 mt-2">{sub.scheduled}h of {sub.total}h scheduled</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
