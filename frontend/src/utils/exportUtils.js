import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export study plan as PDF
 */
export function exportPDF(schedule, subjects, config) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Smart Study Planner AI', 14, 12);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}  |  Daily Hours: ${config.dailyHours}h  |  Start: ${config.startDate}`, 14, 22);

  let y = 36;

  // Subjects summary table
  doc.setTextColor(40, 40, 60);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Subject Overview', 14, y);
  y += 5;

  const subjectRows = subjects.map(s => [
    s.name,
    s.difficulty,
    `${s.totalHours}h`,
    s.examDate,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Subject', 'Difficulty', 'Hours', 'Exam Date']],
    body: subjectRows,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [245, 245, 255] },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Schedule table
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 40, 60);
  doc.text('Study Schedule', 14, y);
  y += 5;

  const scheduleRows = [];
  for (const [date, tasks] of Object.entries(schedule).sort()) {
    for (const task of tasks) {
      scheduleRows.push([
        date,
        new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        task.subjectName,
        `${task.hours}h`,
        task.difficulty,
      ]);
    }
  }

  autoTable(doc, {
    startY: y,
    head: [['Date', 'Day', 'Subject', 'Hours', 'Difficulty']],
    body: scheduleRows,
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 247, 255] },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 180);
    doc.text(`Smart Study Planner AI  |  Page ${i} of ${pageCount}`, 14, 290);
  }

  doc.save('study-plan.pdf');
}

/**
 * Export study plan as CSV
 */
export function exportCSV(schedule, subjects) {
  const rows = [['Date', 'Day', 'Subject', 'Hours', 'Difficulty', 'Exam Date']];

  const subjectMap = {};
  subjects.forEach(s => { subjectMap[s.name] = s; });

  for (const [date, tasks] of Object.entries(schedule).sort()) {
    const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    for (const task of tasks) {
      const sub = subjectMap[task.subjectName];
      rows.push([date, day, task.subjectName, task.hours, task.difficulty, sub?.examDate || '']);
    }
  }

  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'study-timetable.csv';
  a.click();
  URL.revokeObjectURL(url);
}
