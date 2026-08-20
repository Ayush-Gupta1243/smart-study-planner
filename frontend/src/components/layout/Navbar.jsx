import { motion } from 'framer-motion';
import { Brain, Moon, Sun, BookOpen, BarChart2, Calendar, Home } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const navLinks = [
  { label: 'Dashboard', icon: Home, id: 'dashboard' },
  { label: 'Study Plan', icon: Calendar, id: 'plan' },
  { label: 'Analytics', icon: BarChart2, id: 'analytics' },
];

export default function Navbar({ activePage, setActivePage, hasData }) {
  const { isDark, toggle } = useTheme();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center pulse-glow">
            <Brain size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text hidden sm:block">SmartStudy AI</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activePage === link.id;
            const disabled = !hasData && link.id !== 'dashboard';
            return (
              <button
                key={link.id}
                onClick={() => !disabled && setActivePage(link.id)}
                disabled={disabled}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : disabled
                      ? 'text-white/20 cursor-not-allowed'
                      : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                  }`}
              >
                <Icon size={15} />
                <span className="hidden sm:block">{link.label}</span>
              </button>
            );
          })}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-xl glass flex items-center justify-center text-white/70 hover:text-white transition-all hover:bg-white/10"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </motion.nav>
  );
}
