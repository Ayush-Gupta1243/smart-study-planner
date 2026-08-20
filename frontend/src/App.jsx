import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/ui/Hero';
import UploadPanel from './components/ui/UploadPanel';
import Dashboard from './components/ui/Dashboard';
import StudyPlanView from './components/ui/StudyPlanView';
import Analytics from './components/charts/Analytics';
import ExportBar from './components/ui/ExportBar';
import { generateStudyPlan } from './utils/scheduler';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [subjects, setSubjects] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [stats, setStats] = useState(null);
  const [config, setConfig] = useState(null);
  const [hasData, setHasData] = useState(false);

  function handleGenerate(parsedSubjects, cfg) {
    setSubjects(parsedSubjects);
    setConfig(cfg);
    const result = generateStudyPlan(parsedSubjects, cfg);
    setSchedule(result.schedule);
    setWarnings(result.warnings);
    setStats(result.stats);
    setHasData(true);
    setActivePage('dashboard');
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f0e17 0%, #1a1530 50%, #0f1520 100%)' }}>
        <Navbar activePage={activePage} setActivePage={setActivePage} hasData={hasData} />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1830',
              color: '#e8e8e8',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              fontSize: '14px',
            },
          }}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80 shrink-0">
              <UploadPanel onGenerate={handleGenerate} />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {!hasData ? (
                <Hero />
              ) : (
                <AnimatePresence mode="wait">
                  {activePage === 'dashboard' && (
                    <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-white/90">Dashboard</h2>
                          <p className="text-sm text-white/40">Your personalized study overview</p>
                        </div>
                        {config && <ExportBar schedule={schedule} subjects={subjects} config={config} />}
                      </div>
                      <Dashboard subjects={subjects} schedule={schedule} stats={stats} warnings={warnings} />
                    </motion.div>
                  )}
                  {activePage === 'plan' && (
                    <motion.div key="plan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                        <div>
                          <h2 className="text-xl font-bold text-white/90">Study Plan</h2>
                          <p className="text-sm text-white/40">Your day-by-day schedule</p>
                        </div>
                        {config && <ExportBar schedule={schedule} subjects={subjects} config={config} />}
                      </div>
                      <StudyPlanView schedule={schedule} subjects={subjects} />
                    </motion.div>
                  )}
                  {activePage === 'analytics' && (
                    <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <div className="mb-5">
                        <h2 className="text-xl font-bold text-white/90">Analytics</h2>
                        <p className="text-sm text-white/40">Visual breakdown of your study plan</p>
                      </div>
                      <Analytics subjects={subjects} schedule={schedule} stats={stats} />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}
