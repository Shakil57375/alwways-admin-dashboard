import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';

// Export data to CSV format
export const exportToCSV = (data, filename = 'users') => {
  try {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Prepare the data with proper column headers
    const csvData = data.map((item) => ({
      ID: item.id || '',
      Name: item.name || '',
      Email: item.email || '',
      'Contact Number': item.phone || item.contactNumber || '',
      Location: item.location || '',
      'Subscription Type': item.subscriptionType || 'N/A',
      Income: item.income || 'N/A',
      Status: item.status || 'N/A',
      'Join Date': item.date ? new Date(item.date).toLocaleDateString() : '',
    }));

    // Create CSV content
    const headers = Object.keys(csvData[0]);
    let csv = headers.join(',') + '\n';

    csvData.forEach((row) => {
      csv +=
        headers
          .map((header) => {
            const value = row[header];
            // Escape values that contain commas or quotes
            if (
              typeof value === 'string' &&
              (value.includes(',') || value.includes('"'))
            ) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          })
          .join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().getTime()}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);

    toast.success('CSV exported successfully!');
  } catch (error) {
    console.error('CSV export error:', error);
    toast.error('Failed to export CSV');
  }
};

// Export data to Excel format
export const exportToExcel = (data, filename = 'users') => {
  try {
    if (!data || data.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Prepare the data with proper column headers
    const excelData = data.map((item) => ({
      ID: item.id || '',
      Name: item.name || '',
      Email: item.email || '',
      'Contact Number': item.phone || item.contactNumber || '',
      Location: item.location || '',
      'Subscription Type': item.subscriptionType || 'N/A',
      Income: item.income || 'N/A',
      Status: item.status || 'N/A',
      'Join Date': item.date ? new Date(item.date).toLocaleDateString() : '',
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Add some styling to the header row
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4472C4' } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }

    // Set column widths
    const colWidths = Object.keys(excelData[0] || {}).map(() => 18);
    worksheet['!cols'] = colWidths.map((width) => ({ wch: width }));

    // Write file
    XLSX.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
    toast.success('Excel file exported successfully!');
  } catch (error) {
    console.error('Excel export error:', error);
    toast.error('Failed to export Excel file');
  }
};
