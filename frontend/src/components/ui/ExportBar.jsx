import { motion } from 'framer-motion';
import { FileDown, Table, Printer } from 'lucide-react';
import { exportPDF, exportCSV } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

export default function ExportBar({ schedule, subjects, config }) {
  function handlePDF() {
    try {
      exportPDF(schedule, subjects, config);
      toast.success('📄 PDF exported!');
    } catch (e) {
      toast.error('PDF export failed');
    }
  }

  function handleCSV() {
    try {
      exportCSV(schedule, subjects);
      toast.success('📊 CSV downloaded!');
    } catch (e) {
      toast.error('CSV export failed');
    }
  }

  function handlePrint() {
    window.print();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3"
    >
      <button onClick={handlePDF}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/70 hover:text-white hover:border-indigo-500/40 transition-all">
        <FileDown size={15} className="text-indigo-400" />
        Export PDF
      </button>
      <button onClick={handleCSV}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/70 hover:text-white hover:border-cyan-500/40 transition-all">
        <Table size={15} className="text-cyan-400" />
        Download CSV
      </button>
      <button onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-sm text-white/70 hover:text-white hover:border-violet-500/40 transition-all">
        <Printer size={15} className="text-violet-400" />
        Print
      </button>
    </motion.div>
  );
}
