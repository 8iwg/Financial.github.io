import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Configure jsPDF for Arabic support
const configureArabicFont = (doc) => {
  // This is a workaround since Arabic fonts need special handling
  doc.setLanguage("ar");
};

export const exportToExcel = (data, filename = 'financial_report.xlsx') => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Set column widths
    const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: 20 }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'البيانات المالية');

    // Generate Excel file
    XLSX.writeFile(wb, filename);

    return { success: true, message: 'تم تصدير الملف بنجاح' };
  } catch (error) {
    console.error('Excel Export Error:', error);
    return { success: false, message: 'حدث خطأ أثناء التصدير' };
  }
};

export const exportToPDF = (data, columns, title = 'التقرير المالي', filename = 'financial_report.pdf') => {
  try {
    // Create new PDF document
    const doc = new jsPDF('p', 'mm', 'a4');

    configureArabicFont(doc);

    // Add title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

    // Add date
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleDateString('ar-SA');
    doc.text(`Date: ${currentDate}`, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

    // Prepare table data
    const tableData = data.map(row => 
      columns.map(col => row[col.key] || '')
    );

    const tableHeaders = columns.map(col => col.label);

    // Add table
    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 40,
      styles: {
        font: 'helvetica',
        fontSize: 10,
        cellPadding: 5,
        lineColor: [68, 68, 68],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [26, 26, 26],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0]
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      margin: { top: 40, right: 15, bottom: 20, left: 15 }
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save PDF
    doc.save(filename);

    return { success: true, message: 'تم تصدير الملف بنجاح' };
  } catch (error) {
    console.error('PDF Export Error:', error);
    return { success: false, message: 'حدث خطأ أثناء التصدير' };
  }
};

export const formatCurrency = (amount, includeSymbol = true) => {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);

  return includeSymbol ? `${formatted} ﷼` : formatted;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
