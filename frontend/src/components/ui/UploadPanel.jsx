import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileText, AlertCircle, Sparkles, Clock,
  Calendar, Coffee, BookOpen, Play, Download,
  Plus, Trash2, PenLine, CheckCircle2, ChevronDown
} from 'lucide-react';
import { parseSubjectsFromText, SAMPLE_DATA } from '../../utils/scheduler';
import toast from 'react-hot-toast';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const EMPTY_SUBJECT = { name: '', totalHours: '', difficulty: 'Medium', examDate: '' };

// Deterministic color per subject name (same as scheduler.js)
function subjectColor(name) {
  const colors = ['#818cf8','#a78bfa','#22d3ee','#34d399','#fb923c','#f472b6','#facc15','#60a5fa'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function UploadPanel({ onGenerate }) {
  // 'file' | 'manual'
  const [inputMode, setInputMode] = useState('file');

  // File upload state
  const [subjects, setSubjects]     = useState([]);
  const [fileError, setFileError]   = useState('');
  const [fileName, setFileName]     = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef();

  // Manual entry state
  const [manualSubjects, setManualSubjects] = useState([{ ...EMPTY_SUBJECT, _id: Date.now() }]);
  const [manualErrors, setManualErrors]     = useState({});

  // Shared config
  const [config, setConfig] = useState({
    startDate:     new Date().toISOString().split('T')[0],
    dailyHours:    6,
    sessionLength: 2,
    breakDuration: 15,
  });

  // ── File upload handlers ───────────────────────────────────────────────────
  function handleFile(file) {
    if (!file || !file.name.endsWith('.txt')) {
      setFileError('Please upload a .txt file');
      return;
    }
    setFileError('');
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseSubjectsFromText(e.target.result);
        if (!parsed.length) throw new Error();
        setSubjects(parsed);
        toast.success(`✅ ${parsed.length} subjects loaded!`);
      } catch {
        setFileError('Invalid format. Check the example below.');
      }
    };
    reader.readAsText(file);
  }

  function loadSample() {
    const parsed = parseSubjectsFromText(SAMPLE_DATA);
    setSubjects(parsed);
    setFileName('sample_data.txt');
    toast.success(`📚 ${parsed.length} sample subjects loaded!`);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  // ── Manual entry handlers ──────────────────────────────────────────────────
  function addRow() {
    setManualSubjects(prev => [...prev, { ...EMPTY_SUBJECT, _id: Date.now() }]);
  }

  function removeRow(id) {
    setManualSubjects(prev => prev.filter(s => s._id !== id));
    setManualErrors(prev => { const n = { ...prev }; delete n[id]; return n; });
  }

  function updateRow(id, field, value) {
    setManualSubjects(prev => prev.map(s => s._id === id ? { ...s, [field]: value } : s));
    // clear error for that field
    setManualErrors(prev => {
      const n = { ...prev };
      if (n[id]) { delete n[id][field]; }
      return n;
    });
  }

  function validateManual() {
    const errors = {};
    let valid = true;
    manualSubjects.forEach(s => {
      const rowErr = {};
      if (!s.name.trim())              { rowErr.name = 'Required'; valid = false; }
      if (!s.totalHours || isNaN(parseFloat(s.totalHours)) || parseFloat(s.totalHours) <= 0)
                                       { rowErr.totalHours = 'Enter valid hours'; valid = false; }
      if (!s.examDate)                 { rowErr.examDate = 'Required'; valid = false; }
      else if (new Date(s.examDate) <= new Date())
                                       { rowErr.examDate = 'Must be future date'; valid = false; }
      if (Object.keys(rowErr).length)  errors[s._id] = rowErr;
    });
    setManualErrors(errors);
    return valid;
  }

  function buildManualSubjects() {
    return manualSubjects.map(s => ({
      id:           `${s.name.toLowerCase().replace(/\s+/g,'_')}_${s._id}`,
      name:         s.name.trim(),
      totalHours:   parseFloat(s.totalHours),
      remainingHours: parseFloat(s.totalHours),
      difficulty:   s.difficulty,
      examDate:     s.examDate,
      color:        subjectColor(s.name.trim()),
    }));
  }

  // ── Generate ───────────────────────────────────────────────────────────────
  function handleGenerate() {
    if (inputMode === 'file') {
      if (!subjects.length) { toast.error('Upload a subject file first!'); return; }
      onGenerate(subjects, config);
    } else {
      if (!manualSubjects.length) { toast.error('Add at least one subject!'); return; }
      if (!validateManual()) { toast.error('Fix errors in the form!'); return; }
      onGenerate(buildManualSubjects(), config);
    }
    toast.success('🚀 Study plan generated!');
  }

  // ── Active subjects list (for preview) ────────────────────────────────────
  const activeSubjects = inputMode === 'file' ? subjects : buildManualSubjects().filter(s => s.name);

  return (
    <div className="space-y-5">

      {/* ── Mode Toggle ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-1.5 border border-white/10 flex"
      >
        <ModeBtn active={inputMode === 'file'}   onClick={() => setInputMode('file')}   icon={<Upload size={14}  />} label="Upload File"   />
        <ModeBtn active={inputMode === 'manual'} onClick={() => setInputMode('manual')} icon={<PenLine size={14} />} label="Enter Manually" />
      </motion.div>

      {/* ── Input Section ───────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* FILE UPLOAD */}
        {inputMode === 'file' && (
          <motion.div
            key="file"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            className="glass rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-indigo-400" />
              <h2 className="font-semibold text-white/90 text-sm">Upload Subject File</h2>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current.click()}
              className={`relative border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-300
                ${isDragging
                  ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                  : 'border-white/15 hover:border-indigo-400/50 hover:bg-white/5'}`}
            >
              <input ref={fileRef} type="file" accept=".txt" className="hidden" onChange={e => handleFile(e.target.files[0])} />
              <Upload size={28} className={`mx-auto mb-2.5 ${isDragging ? 'text-indigo-400' : 'text-white/25'}`} />
              {fileName ? (
                <div>
                  <p className="text-indigo-300 font-medium text-sm">{fileName}</p>
                  <p className="text-white/40 text-xs mt-1">{subjects.length} subjects loaded</p>
                </div>
              ) : (
                <div>
                  <p className="text-white/65 font-medium text-sm">Drop .txt file here</p>
                  <p className="text-white/30 text-xs mt-1">or click to browse</p>
                </div>
              )}
            </div>

            {fileError && (
              <p className="flex items-center gap-1.5 mt-2.5 text-red-400 text-xs">
                <AlertCircle size={12} />{fileError}
              </p>
            )}

            {/* Format hint */}
            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/5">
              <p className="text-[11px] text-white/35 mb-1.5 font-mono">Format: Name,Hours,Difficulty,ExamDate</p>
              <pre className="text-[11px] text-cyan-400/75 font-mono leading-relaxed">
{`Mathematics,20,Hard,2026-07-10
Physics,15,Medium,2026-07-15
Chemistry,10,Easy,2026-07-20`}
              </pre>
            </div>

            <button
              onClick={loadSample}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-indigo-500/25 text-indigo-300 text-xs hover:bg-indigo-500/10 transition-all"
            >
              <Download size={13} /> Load Sample Dataset
            </button>
          </motion.div>
        )}

        {/* MANUAL ENTRY */}
        {inputMode === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="glass rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PenLine size={16} className="text-violet-400" />
                <h2 className="font-semibold text-white/90 text-sm">Add Your Subjects</h2>
              </div>
              <span className="text-xs text-white/30">{manualSubjects.length} subject{manualSubjects.length !== 1 ? 's' : ''}</span>
            </div>

            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {manualSubjects.map((s, idx) => (
                <SubjectRow
                  key={s._id}
                  subject={s}
                  index={idx}
                  errors={manualErrors[s._id] || {}}
                  onChange={(field, val) => updateRow(s._id, field, val)}
                  onRemove={() => removeRow(s._id)}
                  canRemove={manualSubjects.length > 1}
                />
              ))}
            </div>

            <button
              onClick={addRow}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/15 text-white/45 text-xs hover:border-indigo-400/40 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
            >
              <Plus size={13} /> Add Another Subject
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Study Preferences ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-violet-400" />
          <h2 className="font-semibold text-white/90 text-sm">Study Preferences</h2>
        </div>

        <div className="space-y-4">
          <ConfigField icon={Calendar} label="Study Start Date" type="date"
            value={config.startDate} onChange={v => setConfig(c => ({ ...c, startDate: v }))} />
          <ConfigField icon={Clock} label={`Daily Hours: ${config.dailyHours}h`} type="range"
            min={1} max={12} step={0.5} value={config.dailyHours}
            onChange={v => setConfig(c => ({ ...c, dailyHours: parseFloat(v) }))} />
          <ConfigField icon={BookOpen} label={`Session Length: ${config.sessionLength}h`} type="range"
            min={0.5} max={4} step={0.5} value={config.sessionLength}
            onChange={v => setConfig(c => ({ ...c, sessionLength: parseFloat(v) }))} />
          <ConfigField icon={Coffee} label={`Break: ${config.breakDuration} min`} type="range"
            min={5} max={60} step={5} value={config.breakDuration}
            onChange={v => setConfig(c => ({ ...c, breakDuration: parseInt(v) }))} />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
        >
          <Play size={15} /> Generate Smart Plan
        </motion.button>
      </motion.div>

      {/* ── Subjects Preview ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeSubjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-5 border border-white/10"
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <h2 className="font-semibold text-white/90 text-sm">
                {inputMode === 'file' ? 'Loaded' : 'Preview'} — {activeSubjects.length} Subject{activeSubjects.length !== 1 ? 's' : ''}
              </h2>
            </div>
            <div className="space-y-2">
              {activeSubjects.map(s => (
                <div key={s.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-white/80 truncate max-w-[110px]">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/35 shrink-0">
                    <span>{s.totalHours}h</span>
                    <span className={`px-1.5 py-0.5 rounded-full border ${
                      s.difficulty === 'Hard'   ? 'border-red-500/30 text-red-400' :
                      s.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400' :
                                                  'border-emerald-500/30 text-emerald-400'
                    }`}>{s.difficulty}</span>
                    <span>{s.examDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function ModeBtn({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
        ${active
          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20'
          : 'text-white/45 hover:text-white/70'}`}
    >
      {icon}{label}
    </button>
  );
}

function SubjectRow({ subject, index, errors, onChange, onRemove, canRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="p-3.5 rounded-xl border border-white/8 bg-white/3 space-y-3"
    >
      {/* Row header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-white/35 uppercase tracking-wider">Subject {index + 1}</span>
        {canRemove && (
          <button
            onClick={onRemove}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Subject Name */}
      <div>
        <label className="text-xs text-white/45 mb-1 block">Subject Name *</label>
        <input
          type="text"
          placeholder="e.g. Mathematics"
          value={subject.name}
          onChange={e => onChange('name', e.target.value)}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white/85 placeholder-white/20
            focus:outline-none focus:border-indigo-500/50 transition-colors
            ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
        />
        {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
      </div>

      {/* Hours + Difficulty row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="text-xs text-white/45 mb-1 block">Study Hours *</label>
          <input
            type="number"
            min="1" max="200" step="0.5"
            placeholder="e.g. 20"
            value={subject.totalHours}
            onChange={e => onChange('totalHours', e.target.value)}
            className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white/85 placeholder-white/20
              focus:outline-none focus:border-indigo-500/50 transition-colors
              ${errors.totalHours ? 'border-red-500/50' : 'border-white/10'}`}
          />
          {errors.totalHours && <p className="text-[11px] text-red-400 mt-1">{errors.totalHours}</p>}
        </div>

        <div>
          <label className="text-xs text-white/45 mb-1 block">Difficulty *</label>
          <div className="relative">
            <select
              value={subject.difficulty}
              onChange={e => onChange('difficulty', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/85
                focus:outline-none focus:border-indigo-500/50 transition-colors appearance-none cursor-pointer"
            >
              {DIFFICULTIES.map(d => (
                <option key={d} value={d} className="bg-[#1a1830] text-white">{d}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Exam Date */}
      <div>
        <label className="text-xs text-white/45 mb-1 block">Exam Date *</label>
        <input
          type="date"
          value={subject.examDate}
          min={new Date().toISOString().split('T')[0]}
          onChange={e => onChange('examDate', e.target.value)}
          className={`w-full bg-white/5 border rounded-lg px-3 py-2 text-sm text-white/85
            focus:outline-none focus:border-indigo-500/50 transition-colors
            ${errors.examDate ? 'border-red-500/50' : 'border-white/10'}`}
        />
        {errors.examDate && <p className="text-[11px] text-red-400 mt-1">{errors.examDate}</p>}
      </div>

      {/* Difficulty badge */}
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border
        ${subject.difficulty === 'Hard'   ? 'border-red-500/25 bg-red-500/10 text-red-400' :
          subject.difficulty === 'Medium' ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' :
                                            'border-emerald-500/25 bg-emerald-500/10 text-emerald-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full
          ${subject.difficulty === 'Hard'   ? 'bg-red-400' :
            subject.difficulty === 'Medium' ? 'bg-amber-400' :
                                              'bg-emerald-400'}`} />
        {subject.difficulty === 'Hard'   ? 'High priority in schedule' :
         subject.difficulty === 'Medium' ? 'Medium priority' :
                                           'Lower priority'}
      </div>
    </motion.div>
  );
}

function ConfigField({ icon: Icon, label, type, value, onChange, min, max, step }) {
  return (
    <div>
      <label className="flex items-center gap-2 text-xs text-white/55 mb-2">
        <Icon size={13} className="text-indigo-400" />{label}
      </label>
      {type === 'range' ? (
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #6366f1 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`
          }}
        />
      ) : (
        <input
          type={type} value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/80 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      )}
    </div>
  );
}
