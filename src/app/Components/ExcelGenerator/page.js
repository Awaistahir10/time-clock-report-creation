import { calculateTimeDifference } from '@/app/utils/calculateTimeDifference';
import { calculateWage } from '@/app/utils/calculateWage';
import { calculateWeeklyBreakHours, calculateWeeklyTrackedHours, calculateWeeklyWage } from '@/app/utils/calculateWeeklyDetails';
import { formatDate } from '@/app/utils/formatDate';
import { formatTime } from '@/app/utils/formatTime';
import { getDayOfWeek } from '@/app/utils/getDayOfWeek';
import { getWeekOfMonth } from '@/app/utils/getWeekOfMonth';
import { millisecondsToHHMM } from '@/app/utils/millisecondsToHHMM';
import React from 'react';
import writeXlsxFile from 'write-excel-file';

const ExcelGenerator = ({ userData }) => {
  const handleExcelDownload = async () => {
    const sheets = userData.map((item, index, array) => {
      const sheetName = `${item.name} (${index + 1})`;

      const currentWeek = getWeekOfMonth(item.date);
      const nextItem = array[index + 1];
      const nextWeek = nextItem ? getWeekOfMonth(nextItem.date) : null;
      const isEndOfWeek = currentWeek !== nextWeek;
      const isFirstOfWeek = index === 0 || currentWeek !== getWeekOfMonth(array[index - 1].date);

      const sheetData = [
        [{ value: null }, { value: 'Payroll Summary', fontWeight: 'bold' }],
        [],
        [{ value: null }, { value: 'Start Date', fontWeight: 'bold' }, { value: '4/1/2024' }, { value: null }, { value: 'End Date', fontWeight: 'bold' }, { value: '4/30/2024' }],
        [],
        [
          { value: null },
          { value: 'Employee Name', fontWeight: 'bold' },
          { value: 'Employee Type', fontWeight: 'bold' },
          { value: 'Employee Number', fontWeight: 'bold' },
          { value: 'RATE', fontWeight: 'bold' }
        ],
        [
          { value: null },
          { value: item.name },
          { value: item.organizationRole },
          { value: item.employeeId },
          { value: item.rate }
        ],
        [],
        [
          { value: 'WEEK', fontWeight: 'bold' },
          { value: 'DAY', fontWeight: 'bold' },
          { value: 'DATE IN', fontWeight: 'bold' },
          { value: 'TIME IN', fontWeight: 'bold' },
          { value: 'DATE OUT', fontWeight: 'bold' },
          { value: 'TIME OUT', fontWeight: 'bold' },
          { value: 'Department', fontWeight: 'bold' },
          { value: 'Type', fontWeight: 'bold' },
          { value: 'Hrs:Minutes', fontWeight: 'bold' },
          { value: 'Hours', fontWeight: 'bold' },
          { value: 'WAGES', fontWeight: 'bold' },
          { value: 'Total Tracked Hours', fontWeight: 'bold' },
          { value: 'Total Break Hours', fontWeight: 'bold' },
          { value: 'Total Wages', fontWeight: 'bold' }
        ],
        [
          { value: isFirstOfWeek ? currentWeek : '' },
          { value: getDayOfWeek(item.date) },
          { value: formatDate(item.logs[0]?.startTime || '') },
          { value: formatDate(item.logs[item.logs.length - 1]?.endTime || '') },
          { value: item.logs.map(log => formatTime(log.startTime, true)).join(', ') || '-' },
          { value: item.logs.map(log => formatTime(log.endTime, true)).join(', ') || '-' },
          { value: item.logs.map(log => log.department).join(', ') || '-' },
          { value: item.logs.map(log => log.status).join(', ') || '-' },
          { value: item.logs.map(log => calculateTimeDifference(formatTime(log.startTime), formatTime(log.endTime))).join(', ') || '-' },
          { value: item.logs.map(log => calculateTimeDifference(formatTime(log.startTime), formatTime(log.endTime), true)).join(', ') || '-' },
          { value: item.logs.map(log => calculateWage(formatTime(log.startTime), formatTime(log.endTime), log.status, item.rate)).join(', ') || '-' },
          { value: millisecondsToHHMM(item.totalActiveTime) },
          { value: item.totalWage },
          { value: millisecondsToHHMM(item.totalBreakTime) }
        ],
      ];

      if (isEndOfWeek) {
        const weeklyTrackedHours = calculateWeeklyTrackedHours(item.userId, userData);
        const weeklyBreakHours = calculateWeeklyBreakHours(item.userId, userData);
        const weeklyWages = calculateWeeklyWage(item.userId, userData);
        sheetData.push([
          { value: 'WK Totals', backgroundColor: '#FFFF00', fontWeight: 'bold' },
          { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' },
          { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { value: weeklyTrackedHours[currentWeek] || '0:00', backgroundColor: '#FFFF00' }, { value: `$${weeklyWages[currentWeek]?.toFixed(2)}` || '$0.00', backgroundColor: '#FFFF00' }, { value: weeklyBreakHours[currentWeek] || '0:00', backgroundColor: '#FFFF00' }
        ]);
      }

      sheetData.push([], []);

      sheetData.push([
        { value: 'Period Totals', fontWeight: 'bold', backgroundColor: '#FFFF00' },
        { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' },
        { backgroundColor: '#FFFF00' }, { backgroundColor: '#FFFF00' }, { value: '39:59', fontWeight: 'bold', backgroundColor: '#FFFF00' }, { value: '1:20', fontWeight: 'bold', backgroundColor: '#FFFF00' }, { value: '$9,999', fontWeight: 'bold', backgroundColor: '#FFFF00' }
      ]);

      return { name: sheetName, data: sheetData };
    });

    // Extract data arrays from each sheet object
    const sheetData = sheets.map(sheet => sheet.data);

    try {
      await writeXlsxFile(sheetData, {
        fileName: 'Users.xlsx',
        sheets: sheets.map(sheet => sheet.name),
      });
      console.log('Excel file generated successfully');
    } catch (error) {
      console.error('Error generating Excel file:', error);
    }
  };

  return (
    <button onClick={handleExcelDownload} className='bg-green-800 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-lg rounded-full text-white'>
      Download Excel
    </button>
  );
};

export default ExcelGenerator;
