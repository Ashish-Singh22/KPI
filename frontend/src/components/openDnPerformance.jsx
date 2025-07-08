import React from 'react';
import * as XLSX from 'xlsx';

const OpenDnPerformance = ({ p_d, f_d, h_d , final_data}) => {
  // Sample data for demonstration
 const samplePartsData = {
    'D9M': {
      'Direct / OEM': {
        '>=7 days DN Details': [0, 0, 0],
        '0 to 3 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      },
      'Dealer': {
        '0 to 3 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0]
      },
      'ISO': {
        '0 to 3 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      },
      'EDO': {
        '0 to 3 days DN Details': [0, 0, 0]
      },
      'JAKSON SGP EXP': {
        '0 to 3 days DN Details': [0, 0, 0]
      }
    },
    'D9N': {
      'D9N Direct / OEM': {
        '>=7 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0],
        '0 to 3 days DN Details': [0, 0, 0]
      },
      'ISO': {
        '>=7 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      }
    },
    'AM2': {
      'Parts P/L (AM2 Exports)': {
        '0 to 3 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      },
      'ABU (AM2 Domestic)': {
        '4 to 6 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0]
      }
    },
    'AC1': {
      'AC1 Domestics': {
        '0 to 3 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0]
      },
      'AC1 Internal': {
        '4 to 6 days DN Details': [0, 0, 0],
        '0 to 3 days DN Details': [0, 0, 0]
      },
      'AC1 EXPORT': {
        '0 to 3 days DN Details': [0, 0, 0]
      }
    },
    'D2S': {
      'Auto': {
        '0 to 3 days DN Details': [0, 0, 0],
        '>=7 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      }
    }
  };

  const sampleFilterData = {
    'D9M': {
      'Dealer Filter': {
        '0 to 3 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      },
      'ISO Filter': {
        '0 to 3 days DN Details': [0, 0, 0],
        '4 to 6 days DN Details': [0, 0, 0]
      }
    },
    'D2S': {
      'Auto Filter': {
        '0 to 3 days DN Details': [0, 0, 0]
      }
    }
  };

  const sampleHoldData = {
    'D2S-LOC-ILC ': [0, 0, 0],
    'FOC': [0, 0, 0],
    'DPN-LOC-01 ': [0, 0, 0],
    'Other HOLD': [0, 0, 0],
    'AM2 Internal': [0, 0, 0],
    'AC1 INTERNAL': [0, 0, 0],
    'HHP DN': [0, 0, 0],
    'HOLD BY MLL': [0, 0, 0],
    'COO ISSUE': [0, 0, 0],
    'INSPECTION HOLD': [0, 0, 0],
    'D2S HOLD': [0, 0, 0],
    'AP3-LOC-ILC ': [0, 0, 0],
    'HOLD BY CS': [0, 0, 0],
    'ASSESABLE PRICE ISSUE': [0, 0, 0],
    'D9N INTERNAL': [0, 0, 0]
  };

  // Use provided data or fallback to sample data
  const partsData = p_d || samplePartsData;
  const filterData = f_d || sampleFilterData;
  const holdData = h_d || sampleHoldData;

  // Convert value to crores
  const toCrores = (value) => {
    return (value / 100000).toFixed(2);
  };

  // Generate table rows for parts/filter data
  const generateTableRows = (data, title) => {
    const rows = [];
    
    Object.entries(data).forEach(([org, orgData]) => {
      Object.entries(orgData).forEach(([lob, lobData]) => {
        const rowData = {
          org,
          lob,
          '0 to 3 days': lobData['0 to 3 days DN Details'] || [0, 0, 0],
          '4 to 6 days': lobData['4 to 6 days DN Details'] || [0, 0, 0],
          '>=7 days': lobData['>=7 days DN Details'] || [0, 0, 0]
        };
        
        // Calculate totals
        const totalLines = rowData['0 to 3 days'][0] + rowData['4 to 6 days'][0] + rowData['>=7 days'][0];
        const totalQty = rowData['0 to 3 days'][1] + rowData['4 to 6 days'][1] + rowData['>=7 days'][1];
        const totalValue = rowData['0 to 3 days'][2] + rowData['4 to 6 days'][2] + rowData['>=7 days'][2];
        
        rowData.total = [totalLines, totalQty, totalValue];
        rows.push(rowData);
      });
    });
    
    return rows;
  };

  const partsRows = generateTableRows(partsData, 'Parts');
  const filterRows = generateTableRows(filterData, 'Filter');

// Enhanced Download Excel functionality with beautiful formatting
const downloadExcel = () => {
  const workbook = XLSX.utils.book_new();
  
  // Parts Data Sheet
  if (partsRows.length > 0) {
    const partsSheetData = [
      // Main header row
      ['Parts Data Analysis', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      // Column headers with merged cells for day ranges
      ['', '', '0 < 3 days DN Details', '', '', '4 to 6 Days DN Details', '', '', '>=7 Days DN Details', '', '', 'Grand Total DN', '', ''],
      ['Org', 'LOB', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr'],
      // Data rows
      ...partsRows.map(row => [
        row.org,
        row.lob,
        row['0 to 3 days'][0],
        row['0 to 3 days'][1],
        toCrores(row['0 to 3 days'][2]),
        row['4 to 6 days'][0],
        row['4 to 6 days'][1],
        toCrores(row['4 to 6 days'][2]),
        row['>=7 days'][0],
        row['>=7 days'][1],
        toCrores(row['>=7 days'][2]),
        row.total[0],
        row.total[1],
        toCrores(row.total[2])
      ])
    ];
    
    const partsSheet = XLSX.utils.aoa_to_sheet(partsSheetData);
    
    // Enhanced styling for Parts sheet
    const partsRange = XLSX.utils.decode_range(partsSheet['!ref']);
    
    // Main title styling (A1)
    partsSheet['A1'] = { 
      v: 'Parts Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'E5E7EB' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'medium', color: { rgb: '374151' } },
          bottom: { style: 'medium', color: { rgb: '374151' } },
          left: { style: 'medium', color: { rgb: '374151' } },
          right: { style: 'medium', color: { rgb: '374151' } }
        }
      } 
    };
    
    // Sub-header styling (row 2 - day range headers)
    const dayRangeHeaders = [
      { range: 'C2:E2', text: '0 < 3 days DN Details', color: '10B981' },
      { range: 'F2:H2', text: '4 to 6 Days DN Details', color: 'F59E0B' },
      { range: 'I2:K2', text: '>=7 Days DN Details', color: 'EF4444' },
      { range: 'L2:N2', text: 'Grand Total DN', color: '6366F1' }
    ];
    
    dayRangeHeaders.forEach(header => {
      const startCell = header.range.split(':')[0];
      if (partsSheet[startCell]) {
        partsSheet[startCell].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
          fill: { fgColor: { rgb: header.color } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '374151' } },
            bottom: { style: 'thin', color: { rgb: '374151' } },
            left: { style: 'thin', color: { rgb: '374151' } },
            right: { style: 'thin', color: { rgb: '374151' } }
          }
        };
      }
    });
    
    // Column headers styling (row 3)
    for (let col = 0; col <= 13; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
      if (partsSheet[cellAddress]) {
        let bgColor = 'F3F4F6';
        if (col >= 2 && col <= 4) bgColor = 'D1FAE5';
        else if (col >= 5 && col <= 7) bgColor = 'FEF3C7';
        else if (col >= 8 && col <= 10) bgColor = 'FEE2E2';
        else if (col >= 11 && col <= 13) bgColor = 'E0E7FF';
        
        partsSheet[cellAddress].s = {
          font: { bold: true, color: { rgb: '1F2937' }, sz: 10 },
          fill: { fgColor: { rgb: bgColor } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '9CA3AF' } },
            bottom: { style: 'thin', color: { rgb: '9CA3AF' } },
            left: { style: 'thin', color: { rgb: '9CA3AF' } },
            right: { style: 'thin', color: { rgb: '9CA3AF' } }
          }
        };
      }
    }
    
    // Data rows styling with alternating colors and column-specific backgrounds
    for (let row = 3; row <= partsRange.e.r; row++) {
      const isEvenRow = (row - 3) % 2 === 0;
      for (let col = 0; col <= 13; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (partsSheet[cellAddress]) {
          let bgColor = isEvenRow ? 'FFFFFF' : 'F9FAFB';
          
          // Apply column-specific background colors like in the image
          if (col >= 2 && col <= 4) {
            bgColor = isEvenRow ? 'F0FDF4' : 'DCFCE7'; // Light green for 0-3 days
          } else if (col >= 5 && col <= 7) {
            bgColor = isEvenRow ? 'FFFBEB' : 'FEF3C7'; // Light yellow for 4-6 days
          } else if (col >= 8 && col <= 10) {
            bgColor = isEvenRow ? 'FEF2F2' : 'FEE2E2'; // Light red for >=7 days
          } else if (col >= 11 && col <= 13) {
            bgColor = isEvenRow ? 'EFF6FF' : 'DBEAFE'; // Light blue for totals
          }
          
          partsSheet[cellAddress].s = {
            font: { color: { rgb: '1F2937' }, sz: 10 },
            fill: { fgColor: { rgb: bgColor } },
            alignment: { 
              horizontal: col <= 1 ? 'left' : 'center', 
              vertical: 'center' 
            },
            border: {
              top: { style: 'thin', color: { rgb: 'E5E7EB' } },
              bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
              left: { style: 'thin', color: { rgb: 'E5E7EB' } },
              right: { style: 'thin', color: { rgb: 'E5E7EB' } }
            }
          };
          
          // Special formatting for value columns
          if ([4, 7, 10, 13].includes(col)) {
            partsSheet[cellAddress].s.numFmt = '#,##0.00';
          }
        }
      }
    }
    
    // Set column widths
    partsSheet['!cols'] = [
      { wch: 8 },   // Org
      { wch: 20 },  // LOB
      { wch: 8 },   // Lines
      { wch: 8 },   // Qty
      { wch: 12 },  // Value In Cr
      { wch: 8 },   // Lines
      { wch: 8 },   // Qty
      { wch: 12 },  // Value In Cr
      { wch: 8 },   // Lines
      { wch: 8 },   // Qty
      { wch: 12 },  // Value In Cr
      { wch: 8 },   // Lines
      { wch: 8 },   // Qty
      { wch: 12 }   // Value In Cr
    ];
    
    // Set row heights
    partsSheet['!rows'] = [
      { hpx: 30 },  // Title row
      { hpx: 25 },  // Sub-header row
      { hpx: 22 },  // Column headers
      ...Array(partsRange.e.r - 2).fill({ hpx: 20 })  // Data rows
    ];
    
    // Merge cells for title and sub-headers
    partsSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },  // Title
      { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },   // 0-3 days
      { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } },   // 4-6 days
      { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } },  // >=7 days
      { s: { r: 1, c: 11 }, e: { r: 1, c: 13 } }  // Grand Total
    ];
    
    XLSX.utils.book_append_sheet(workbook, partsSheet, 'Parts Data');
  }
  
  // Filter Data Sheet (similar styling)
  if (filterRows.length > 0) {
    const filterSheetData = [
      ['Filter Data Analysis', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '0 < 3 days DN Details', '', '', '4 to 6 Days DN Details', '', '', '>=7 Days DN Details', '', '', 'Grand Total DN', '', ''],
      ['Org', 'LOB', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr'],
      ...filterRows.map(row => [
        row.org, row.lob, row['0 to 3 days'][0], row['0 to 3 days'][1], toCrores(row['0 to 3 days'][2]),
        row['4 to 6 days'][0], row['4 to 6 days'][1], toCrores(row['4 to 6 days'][2]),
        row['>=7 days'][0], row['>=7 days'][1], toCrores(row['>=7 days'][2]),
        row.total[0], row.total[1], toCrores(row.total[2])
      ])
    ];
    
    const filterSheet = XLSX.utils.aoa_to_sheet(filterSheetData);
    
    // Apply similar styling as Parts sheet but with purple theme
    const filterRange = XLSX.utils.decode_range(filterSheet['!ref']);
    
    // Main title styling
    filterSheet['A1'] = { 
      v: 'Filter Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'EDE9FE' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'medium', color: { rgb: '7C3AED' } },
          bottom: { style: 'medium', color: { rgb: '7C3AED' } },
          left: { style: 'medium', color: { rgb: '7C3AED' } },
          right: { style: 'medium', color: { rgb: '7C3AED' } }
        }
      } 
    };
    
    // Sub-header styling for filter sheet
    const filterDayRangeHeaders = [
      { range: 'C2:E2', text: '0 < 3 days DN Details', color: '10B981' },
      { range: 'F2:H2', text: '4 to 6 Days DN Details', color: 'F59E0B' },
      { range: 'I2:K2', text: '>=7 Days DN Details', color: 'EF4444' },
      { range: 'L2:N2', text: 'Grand Total DN', color: '6366F1' }
    ];
    
    filterDayRangeHeaders.forEach(header => {
      const startCell = header.range.split(':')[0];
      if (filterSheet[startCell]) {
        filterSheet[startCell].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
          fill: { fgColor: { rgb: header.color } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '374151' } },
            bottom: { style: 'thin', color: { rgb: '374151' } },
            left: { style: 'thin', color: { rgb: '374151' } },
            right: { style: 'thin', color: { rgb: '374151' } }
          }
        };
      }
    });
    
    // Column headers styling (row 3)
    for (let col = 0; col <= 13; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 2, c: col });
      if (filterSheet[cellAddress]) {
        let bgColor = 'F3F4F6';
        if (col >= 2 && col <= 4) bgColor = 'D1FAE5';
        else if (col >= 5 && col <= 7) bgColor = 'FEF3C7';
        else if (col >= 8 && col <= 10) bgColor = 'FEE2E2';
        else if (col >= 11 && col <= 13) bgColor = 'E0E7FF';
        
        filterSheet[cellAddress].s = {
          font: { bold: true, color: { rgb: '1F2937' }, sz: 10 },
          fill: { fgColor: { rgb: bgColor } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '9CA3AF' } },
            bottom: { style: 'thin', color: { rgb: '9CA3AF' } },
            left: { style: 'thin', color: { rgb: '9CA3AF' } },
            right: { style: 'thin', color: { rgb: '9CA3AF' } }
          }
        };
      }
    }
    
    // Data rows styling with alternating colors and column-specific backgrounds
    for (let row = 3; row <= filterRange.e.r; row++) {
      const isEvenRow = (row - 3) % 2 === 0;
      for (let col = 0; col <= 13; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (filterSheet[cellAddress]) {
          let bgColor = isEvenRow ? 'FFFFFF' : 'F9FAFB';
          
          // Apply column-specific background colors like in the image
          if (col >= 2 && col <= 4) {
            bgColor = isEvenRow ? 'F0FDF4' : 'DCFCE7'; // Light green for 0-3 days
          } else if (col >= 5 && col <= 7) {
            bgColor = isEvenRow ? 'FFFBEB' : 'FEF3C7'; // Light yellow for 4-6 days
          } else if (col >= 8 && col <= 10) {
            bgColor = isEvenRow ? 'FEF2F2' : 'FEE2E2'; // Light red for >=7 days
          } else if (col >= 11 && col <= 13) {
            bgColor = isEvenRow ? 'EFF6FF' : 'DBEAFE'; // Light blue for totals
          }
          
          filterSheet[cellAddress].s = {
            font: { color: { rgb: '1F2937' }, sz: 10 },
            fill: { fgColor: { rgb: bgColor } },
            alignment: { 
              horizontal: col <= 1 ? 'left' : 'center', 
              vertical: 'center' 
            },
            border: {
              top: { style: 'thin', color: { rgb: 'E5E7EB' } },
              bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
              left: { style: 'thin', color: { rgb: 'E5E7EB' } },
              right: { style: 'thin', color: { rgb: 'E5E7EB' } }
            }
          };
          
          // Special formatting for value columns
          if ([4, 7, 10, 13].includes(col)) {
            filterSheet[cellAddress].s.numFmt = '#,##0.00';
          }
        }
      }
    }
    
    // Set column widths
    filterSheet['!cols'] = [
      { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
      { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, { wch: 8 },
      { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
    ];
    
    // Set row heights
    filterSheet['!rows'] = [
      { hpx: 30 },  // Title row
      { hpx: 25 },  // Sub-header row
      { hpx: 22 },  // Column headers
      ...Array(filterRange.e.r - 2).fill({ hpx: 20 })  // Data rows
    ];
    
    // Merge cells for title and sub-headers
    filterSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },  // Title
      { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },   // 0-3 days
      { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } },   // 4-6 days
      { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } },  // >=7 days
      { s: { r: 1, c: 11 }, e: { r: 1, c: 13 } }  // Grand Total
    ];
    
    XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filter Data');
  }
  
  // Hold Data Sheet
  if (Object.keys(holdData).length > 0) {
    const holdSheetData = [
      ['Hold Data Analysis', '', '', ''],
      ['Category', 'Lines', 'Quantity', 'Value (Cr)'],
      ...Object.entries(holdData).map(([category, values]) => [
        category, values[0], values[1], toCrores(values[2])
      ])
    ];
    
    const holdSheet = XLSX.utils.aoa_to_sheet(holdSheetData);
    
    // Enhanced styling for Hold sheet
    const holdRange = XLSX.utils.decode_range(holdSheet['!ref']);
    
    // Main title styling
    holdSheet['A1'] = { 
      v: 'Hold Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'FEE2E2' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'medium', color: { rgb: 'DC2626' } },
          bottom: { style: 'medium', color: { rgb: 'DC2626' } },
          left: { style: 'medium', color: { rgb: 'DC2626' } },
          right: { style: 'medium', color: { rgb: 'DC2626' } }
        }
      } 
    };
    
    // Column headers styling
    for (let col = 0; col <= 3; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 1, c: col });
      if (holdSheet[cellAddress]) {
        holdSheet[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 12 },
          fill: { fgColor: { rgb: 'DC2626' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: '374151' } },
            bottom: { style: 'thin', color: { rgb: '374151' } },
            left: { style: 'thin', color: { rgb: '374151' } },
            right: { style: 'thin', color: { rgb: '374151' } }
          }
        };
      }
    }
    
    // Data rows styling
    for (let row = 2; row <= holdRange.e.r; row++) {
      const isEvenRow = (row - 2) % 2 === 0;
      for (let col = 0; col <= 3; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (holdSheet[cellAddress]) {
          holdSheet[cellAddress].s = {
            font: { color: { rgb: '1F2937' }, sz: 10 },
            fill: { fgColor: { rgb: isEvenRow ? 'FFFFFF' : 'FEF2F2' } },
            alignment: { 
              horizontal: col === 0 ? 'left' : 'center', 
              vertical: 'center' 
            },
            border: {
              top: { style: 'thin', color: { rgb: 'E5E7EB' } },
              bottom: { style: 'thin', color: { rgb: 'E5E7EB' } },
              left: { style: 'thin', color: { rgb: 'E5E7EB' } },
              right: { style: 'thin', color: { rgb: 'E5E7EB' } }
            }
          };
          
          // Special formatting for value column
          if (col === 3) {
            holdSheet[cellAddress].s.numFmt = '#,##0.00';
          }
        }
      }
    }
    
    // Set column widths
    holdSheet['!cols'] = [
      { wch: 25 }, // Category
      { wch: 12 }, // Lines
      { wch: 12 }, // Quantity
      { wch: 15 }  // Value (Cr)
    ];
    
    // Set row heights
    holdSheet['!rows'] = [
      { hpx: 30 },  // Title row
      { hpx: 25 },  // Header row
      ...Array(holdRange.e.r - 1).fill({ hpx: 20 })  // Data rows
    ];
    
    // Merge cells for title
    holdSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }  // Title
    ];
    
    XLSX.utils.book_append_sheet(workbook, holdSheet, 'Hold Data');
  }
  
  // Download the file
  const fileName = `DN_Performance_Analysis_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};

// Enhanced individual sheet download function
const downloadIndividualSheet = (sheetType) => {
  const workbook = XLSX.utils.book_new();
  
  if (sheetType === 'parts' && partsRows.length > 0) {
    const partsSheetData = [
      ['Parts Data Analysis', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '0 < 3 days DN Details', '', '', '4 to 6 Days DN Details', '', '', '>=7 Days DN Details', '', '', 'Grand Total DN', '', ''],
      ['Org', 'LOB', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr'],
      ...partsRows.map(row => [
        row.org, row.lob, row['0 to 3 days'][0], row['0 to 3 days'][1], toCrores(row['0 to 3 days'][2]),
        row['4 to 6 days'][0], row['4 to 6 days'][1], toCrores(row['4 to 6 days'][2]),
        row['>=7 days'][0], row['>=7 days'][1], toCrores(row['>=7 days'][2]),
        row.total[0], row.total[1], toCrores(row.total[2])
      ])
    ];
    
    const partsSheet = XLSX.utils.aoa_to_sheet(partsSheetData);
    
    // Apply the same styling as in the main function
    const partsRange = XLSX.utils.decode_range(partsSheet['!ref']);
    
    // Main title styling
    partsSheet['A1'] = { 
      v: 'Parts Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'E5E7EB' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      } 
    };
    
    // Apply column styling
    partsSheet['!cols'] = [
      { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
      { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, { wch: 8 },
      { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
    ];
    
    // Merge cells
    partsSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } },
      { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } },
      { s: { r: 1, c: 11 }, e: { r: 1, c: 13 } }
    ];
    
    XLSX.utils.book_append_sheet(workbook, partsSheet, 'Parts Data');
    XLSX.writeFile(workbook, `Parts_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  if (sheetType === 'filter' && filterRows.length > 0) {
    const filterSheetData = [
      ['Filter Data Analysis', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      ['', '', '0 < 3 days DN Details', '', '', '4 to 6 Days DN Details', '', '', '>=7 Days DN Details', '', '', 'Grand Total DN', '', ''],
      ['Org', 'LOB', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr', 'Lines', 'Qty', 'Value In Cr'],
      ...filterRows.map(row => [
        row.org, row.lob, row['0 to 3 days'][0], row['0 to 3 days'][1], toCrores(row['0 to 3 days'][2]),
        row['4 to 6 days'][0], row['4 to 6 days'][1], toCrores(row['4 to 6 days'][2]),
        row['>=7 days'][0], row['>=7 days'][1], toCrores(row['>=7 days'][2]),
        row.total[0], row.total[1], toCrores(row.total[2])
      ])
    ];
    
    const filterSheet = XLSX.utils.aoa_to_sheet(filterSheetData);
    
    // Apply styling
    filterSheet['A1'] = { 
      v: 'Filter Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'EDE9FE' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      } 
    };
    
    filterSheet['!cols'] = [
      { wch: 8 }, { wch: 20 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
      { wch: 8 }, { wch: 8 }, { wch: 12 }, { wch: 8 }, { wch: 8 },
      { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
    ];
    
    filterSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 13 } },
      { s: { r: 1, c: 2 }, e: { r: 1, c: 4 } },
      { s: { r: 1, c: 5 }, e: { r: 1, c: 7 } },
      { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } },
      { s: { r: 1, c: 11 }, e: { r: 1, c: 13 } }
    ];
    
    XLSX.utils.book_append_sheet(workbook, filterSheet, 'Filter Data');
    XLSX.writeFile(workbook, `Filter_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
  
  if (sheetType === 'hold' && Object.keys(holdData).length > 0) {
    const holdSheetData = [
      ['Hold Data Analysis', '', '', ''],
      ['Category', 'Lines', 'Quantity', 'Value (Cr)'],
      ...Object.entries(holdData).map(([category, values]) => [
        category, values[0], values[1], toCrores(values[2])
      ])
    ];
    
    const holdSheet = XLSX.utils.aoa_to_sheet(holdSheetData);
    
    // Apply styling
    holdSheet['A1'] = { 
      v: 'Hold Data Analysis', 
      s: { 
        font: { bold: true, sz: 18, color: { rgb: '1F2937' } }, 
        fill: { fgColor: { rgb: 'FEE2E2' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      } 
    };
    
    holdSheet['!cols'] = [
      { wch: 25 }, { wch: 12 }, { wch: 12 }, { wch: 15 }
    ];
    
    holdSheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }
    ];
    
    XLSX.utils.book_append_sheet(workbook, holdSheet, 'Hold Data');
    XLSX.writeFile(workbook, `Hold_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  }
};

const downloadOpenDnDataSheet = () => {
  if (!final_data || final_data.length === 0) {
    console.error("No data to export");
    return;
  }

  // Step 1: Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(final_data);

  // Step 2: Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "OpenDN Data");

  // Step 3: Trigger download
  XLSX.writeFile(workbook, "OpenDnDataSheet.xlsx");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Open DN Performance
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
          </div>
          <p className="text-lg text-gray-600 mt-6 max-w-2xl mx-auto">
            Comprehensive analysis of delivery note performance across different categories
          </p>
          
          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={downloadExcel}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Complete Excel
            </button>

            <button
              onClick={downloadOpenDnDataSheet}
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-green-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download OpenDn Data Sheet
            </button>
            
            <button
              onClick={() => downloadIndividualSheet('parts')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Parts Data
            </button>
            
            {filterRows.length > 0 && (
              <button
                onClick={() => downloadIndividualSheet('filter')}
                className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Filter Data
              </button>
            )}
            
            <button
              onClick={() => downloadIndividualSheet('hold')}
              className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
              Hold Data
            </button>
          </div>
        </div>

        {/* Parts Data Table */}
        <div className="mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4">
                  P
                </div>
                Parts Data Analysis
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-400 to-cyan-400 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Organization</th>
                    <th className="px-6 py-4 text-left font-semibold">Line of Business</th>
                    <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                      <div className="bg-white/20 rounded-lg px-3 py-1">0-3 Days Performance</div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                      <div className="bg-white/20 rounded-lg px-3 py-1">4-6 Days Performance</div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                      <div className="bg-white/20 rounded-lg px-3 py-1">7+ Days Performance</div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                      <div className="bg-white/20 rounded-lg px-3 py-1">Grand Total</div>
                    </th>
                  </tr>
                  <tr className="bg-emerald-300 text-emerald-800 text-sm font-medium">
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3"></th>
                    <th className="px-6 py-3 text-center">Lines</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-center">Value (Cr)</th>
                    <th className="px-6 py-3 text-center">Lines</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-center">Value (Cr)</th>
                    <th className="px-6 py-3 text-center">Lines</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-center">Value (Cr)</th>
                    <th className="px-6 py-3 text-center">Lines</th>
                    <th className="px-6 py-3 text-center">Qty</th>
                    <th className="px-6 py-3 text-center">Value (Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {partsRows.map((row, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-r from-emerald-50 to-cyan-50' : 'bg-white'} hover:bg-gradient-to-r hover:from-emerald-100 hover:to-cyan-100 transition-all duration-300`}>
                      <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{row.org}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium border-r border-gray-200">{row.lob}</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-700">{row['0 to 3 days'][0]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-700">{row['0 to 3 days'][1]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-700">{toCrores(row['0 to 3 days'][2])}</td>
                      <td className="px-6 py-4 text-center font-semibold text-teal-700">{row['4 to 6 days'][0]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-teal-700">{row['4 to 6 days'][1]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-teal-700">{toCrores(row['4 to 6 days'][2])}</td>
                      <td className="px-6 py-4 text-center font-semibold text-cyan-700">{row['>=7 days'][0]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-cyan-700">{row['>=7 days'][1]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-cyan-700">{toCrores(row['>=7 days'][2])}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-orange-400">{row.total[0]}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100">{row.total[1]}</td>
                      <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100">{toCrores(row.total[2])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Filter Data Table */}
        {filterRows.length > 0 && (
          <div className="mb-12">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 p-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4">
                    F
                  </div>
                  Filter Data Analysis
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-violet-400 to-pink-400 text-white">
                      <th className="px-6 py-4 text-left font-semibold">Organization</th>
                      <th className="px-6 py-4 text-left font-semibold">Line of Business</th>
                      <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                        <div className="bg-white/20 rounded-lg px-3 py-1">0-3 Days Performance</div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                        <div className="bg-white/20 rounded-lg px-3 py-1">4-6 Days Performance</div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                        <div className="bg-white/20 rounded-lg px-3 py-1">7+ Days Performance</div>
                      </th>
                      <th className="px-6 py-4 text-center font-semibold" colSpan="3">
                        <div className="bg-white/20 rounded-lg px-3 py-1">Grand Total</div>
                      </th>
                    </tr>
                    <tr className="bg-violet-300 text-violet-800 text-sm font-medium">
                      <th className="px-6 py-3"></th>
                      <th className="px-6 py-3"></th>
                      <th className="px-6 py-3 text-center">Lines</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-center">Value (Cr)</th>
                      <th className="px-6 py-3 text-center">Lines</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-center">Value (Cr)</th>
                      <th className="px-6 py-3 text-center">Lines</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-center">Value (Cr)</th>
                      <th className="px-6 py-3 text-center">Lines</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-center">Value (Cr)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterRows.map((row, index) => (
                      <tr key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-r from-violet-50 to-pink-50' : 'bg-white'} hover:bg-gradient-to-r hover:from-violet-100 hover:to-pink-100 transition-all duration-300`}>
                        <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{row.org}</td>
                        <td className="px-6 py-4 text-gray-700 font-medium border-r border-gray-200">{row.lob}</td>
                        <td className="px-6 py-4 text-center font-semibold text-violet-700">{row['0 to 3 days'][0]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-violet-700">{row['0 to 3 days'][1]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-violet-700">{toCrores(row['0 to 3 days'][2])}</td>
                        <td className="px-6 py-4 text-center font-semibold text-purple-700">{row['4 to 6 days'][0]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-purple-700">{row['4 to 6 days'][1]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-purple-700">{toCrores(row['4 to 6 days'][2])}</td>
                        <td className="px-6 py-4 text-center font-semibold text-pink-700">{row['>=7 days'][0]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-pink-700">{row['>=7 days'][1]}</td>
                        <td className="px-6 py-4 text-center font-semibold text-pink-700">{toCrores(row['>=7 days'][2])}</td>
                        <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100 border-l-4 border-orange-400">{row.total[0]}</td>
                        <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100">{row.total[1]}</td>
                        <td className="px-6 py-4 text-center font-bold text-gray-800 bg-gradient-to-r from-yellow-100 to-orange-100">{toCrores(row.total[2])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Hold Data Table */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="bg-gradient-to-r from-rose-500 via-red-500 to-pink-500 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold mr-4">
                  H
                </div>
                Hold Data Analysis
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-400 to-pink-400 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                    <th className="px-6 py-4 text-center font-semibold">Lines</th>
                    <th className="px-6 py-4 text-center font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-center font-semibold">Value (Cr)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(holdData).map(([category, values], index) => (
                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gradient-to-r from-rose-50 to-pink-50' : 'bg-white'} hover:bg-gradient-to-r hover:from-rose-100 hover:to-pink-100 transition-all duration-300`}>
                      <td className="px-6 py-4 font-bold text-gray-800 border-r border-gray-200">{category}</td>
                      <td className="px-6 py-4 text-center font-semibold text-rose-700">{values[0]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-red-700">{values[1]}</td>
                      <td className="px-6 py-4 text-center font-semibold text-pink-700">{toCrores(values[2])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <div className="inline-block bg-white/40 backdrop-blur-sm rounded-full px-8 py-3 border border-white/30">
            <p className="text-gray-600 font-medium">
              Dashboard powered by advanced analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenDnPerformance;