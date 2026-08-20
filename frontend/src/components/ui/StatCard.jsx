import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, sub, color = 'indigo', delay = 0 }) {
  const gradients = {
    indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20',
    violet: 'from-violet-500/20 to-violet-500/5 border-violet-500/20',
    cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20',
  };
  const iconColors = {
    indigo: 'text-indigo-400 bg-indigo-500/15',
    violet: 'text-violet-400 bg-violet-500/15',
    cyan: 'text-cyan-400 bg-cyan-500/15',
    emerald: 'text-emerald-400 bg-emerald-500/15',
    orange: 'text-orange-400 bg-orange-500/15',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`glass card-hover rounded-2xl p-5 border bg-gradient-to-br ${gradients[color]}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-sm text-white/50 font-medium">{label}</div>
      {sub && <div className="text-xs text-white/30 mt-1">{sub}</div>}
    </motion.div>
  );
}
