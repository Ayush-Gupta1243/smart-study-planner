import { motion } from 'framer-motion';
import { Brain, Sparkles, ArrowDown } from 'lucide-react';

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex flex-col items-center justify-center text-center py-20 px-4"
    >
      {/* Background orbs */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-500 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/30"
      >
        <Brain size={36} className="text-white" />
      </motion.div>

      <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
        <span className="gradient-text">Smart Study Planner</span>
        <br />
        <span className="text-white/80 text-3xl sm:text-4xl">powered by AI</span>
      </h1>

      <p className="text-white/50 text-lg max-w-xl mb-8 leading-relaxed">
        Upload your subjects, set your schedule, and let our AI generate an optimized study plan that adapts to exam dates and difficulty levels.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {['Smart Prioritization', 'Exam Countdown', 'Visual Analytics', 'PDF Export'].map((f, i) => (
          <motion.span
            key={f}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full glass border border-white/10 text-sm text-white/60"
          >
            <Sparkles size={13} className="text-indigo-400" />
            {f}
          </motion.span>
        ))}
      </div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-white/20"
      >
        <ArrowDown size={20} />
      </motion.div>
    </motion.div>
  );
}
