import React, { useEffect, useState } from 'react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import { newPdfStyles } from '@/app/constants/newPdfStyles';
import { tableData, topTable } from '@/app/constants/users';
import { formatTime } from '@/app/utils/formatTime';
import { millisecondsToHHMM } from '@/app/utils/millisecondsToHHMM';
import { MAIN_TABLE_XANDYCOORDINATES } from '@/app/constants/newPdfCoordinates';
import { getDayOfWeek } from '@/app/utils/getDayOfWeek';
import { formatDate } from '@/app/utils/formatDate';
import { getWeekOfMonth } from '@/app/utils/getWeekOfMonth';
import { calculateTotalWage, calculateWage } from '@/app/utils/calculateWage';
import { calculateTimeDifference, calculateTotalTime } from '@/app/utils/calculateTimeDifference';
import { totalWagePerDay } from '@/app/utils/totalWagePerDay';
import { getBase64ImageFromURL } from '@/app/utils/imageToBase64';
import { calculateWeeklyBreakHours, calculateCompleteHours, calculateWeeklyWage, calculateWeeklyTrackedHours } from '@/app/utils/calculateWeeklyDetails';

// Register fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const NewPDFDesign = ({ dynamicData, downloadPdf, viewPdf, userId }) => {

  const [logoBase64, setLogoBase64] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      const logo = await getBase64ImageFromURL('/logo_transparent_background.png'); // Use the correct path
      setLogoBase64(logo);
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    console.log('d1', dynamicData)
    generatePDF(downloadPdf, viewPdf);
  }, [downloadPdf, viewPdf]);

  const generatePDF = () => {
         
    const documentDefinition = {
      content: [
        { 
          image: logoBase64, // Add company logo
          width: 180, // Adjust width as needed
          height: 90,
        },
        {
          canvas: [
            {
              type: 'rect',
              x: MAIN_TABLE_XANDYCOORDINATES.mainRectangle.x,
              y: MAIN_TABLE_XANDYCOORDINATES.mainRectangle.y,
              w: MAIN_TABLE_XANDYCOORDINATES.mainRectangle.width, // Width of A4 page in PDF units
              h: MAIN_TABLE_XANDYCOORDINATES.mainRectangle.height, // Height of A4 page in PDF units
              color: MAIN_TABLE_XANDYCOORDINATES.mainRectangle.color, // Background color of the rectangle
            },
          ],
          absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
        },
        {
          text: MAIN_TABLE_XANDYCOORDINATES.pdfHeaderText.text,
          style: 'heading',
          absolutePosition: { x: MAIN_TABLE_XANDYCOORDINATES.pdfHeaderText.x, y: MAIN_TABLE_XANDYCOORDINATES.pdfHeaderText.y } // Position the text with 40 units left and 10 units top margin
        },
      ],
      styles: newPdfStyles,
      pageMargins: [40, 20, 40, 20], // Define margins for all sides
      pageSize: 'A4', // Set page size
      pageOrientation: 'Landscape',
    };

    if (userId) {
      // If userId is provided, generate PDF for single user
      const userData = dynamicData.filter(item => item.userId === userId);

      if (userData.length > 0) {
        // Calculate total hours worked for the user

        const firstName = userData[0].user.firstName;

        // Add the first name above the table header line
        documentDefinition.content.push({
          text: `Name: ${firstName}`,
          style: { bold: true, fontSize: 12, color: '#4A5056', fillColor: '#518EBD', margin: [0, 0, 16, 0] },
          absolutePosition: { x: MAIN_TABLE_XANDYCOORDINATES.firstName.x, y: MAIN_TABLE_XANDYCOORDINATES.firstName.y }
        });

        let totalHours = 0;
        userData.forEach(item => {
          totalHours += parseInt(item.activeTime);
        });
        
        const initialDetailsTable = [
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto'],
              body: [
                [
                  { text: "DATE", style: 'columnHeader' },
                  { text: "REGULAR HRS", style: 'columnHeader' },
                  { text: "RATE", style: 'columnHeader' },
                ],
                ...topTable.map((item) => [
                  { text: item.date + ' - ' + '27/7/2023', style: 'columnText' },
                  { text: item.regularHours, style: 'columnText' },
                  { text: item.rate, style: 'columnText' },
                ]),
              ],
            },
            layout: {
              hLineWidth: (i, node) => (i === 0 ? 0 : 0), // Hide horizontal lines for rows except header
              vLineWidth: () => 0, // Hide vertical lines
            },
          },
        ];
        documentDefinition.content.push(...initialDetailsTable);

        const userTable = [
          {
            margin: [0, 20, 0, 0],
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: "Date", style: 'employeeTableHeader' },
                  { text: "Start time", style: 'employeeTableHeader' },
                  { text: "End Time", style: 'employeeTableHeader' },
                  { text: "Department ID", style: 'employeeTableHeader' },
                  { text: "Status", style: 'employeeTableHeader' },
                  { text: "Hours", style: 'employeeTableHeader' },
                  { text: "Role", style: 'employeeTableHeader' },
                ],
                ...userData.map((item) => [
                  { text: item.date, style: 'employeeTableData' },
                  { text: item.logs.map(item => formatTime(item.startTime)).join('\n') || '-', style: 'employeeTableData' },
                  { text: item.logs.map(item => formatTime(item.endTime)).join('\n') || '-', style: 'employeeTableData' },
                  { text: item.logs.map(log => log.departmentId.slice(0, -5)) || '-', style: 'employeeTableData' },
                  { text: item.logs.map(log => log.status).join('\n') || '-', style: 'employeeTableData' },
                  { text: millisecondsToHHMM(item.activeTime), style: { employeeTableData: true, fillColor: '#DFEEF9' } },
                  { text: item.user.organizationRole || '-', style: 'employeeTableData' },
                ]),
                [
                  { text: 'Total', style: { alignment: 'right', margin: [0, 0, 16, 0], fontSize: 12, fillColor: '#DFEEF9', color: '#386384', bold: true } },
                  { text: '---', style: 'lastRowTotal' },
                  { text: '---', style: 'lastRowTotal' },
                  { text: '---', style: 'lastRowTotal' },
                  { text: '---', style: 'lastRowTotal' },
                  { text: millisecondsToHHMM(totalHours), style: 'lastRowTotal' },
                  { text: '---', style: 'lastRowTotal' },
                ],
              ],
            },
            layout: {
              hLineWidth: () => 0.2, // Hide horizontal lines for rows except header
              vLineWidth: () => 0.2,
              vLineColor: () => '#CCCCCC',
              hLineColor: () => '#CCCCCC',
            },
          },
        ]

        documentDefinition.content.push(...userTable);
      }

    } else {
        // If userId is not provided, generate PDF for all users
        // Group dynamicData by user IDs
        const groupedData = {};
        dynamicData.forEach(item => {
          const userId = item.userId;
          if (!groupedData[userId]) {
            groupedData[userId] = [];
          }
          groupedData[userId].push(item);
        });

        // Generate table for each user
        for (const userId in groupedData) {
          if (groupedData.hasOwnProperty(userId)) {
            const userData = groupedData[userId];

            const firstName = userData[0].name;
            const employeeID = userData[0].employeeId;
            const designation = userData[0].organizationRole;
            const hourlyRate = userData[0].rate;

            // Calculate total hours worked for the user
            let totalHours = 0;
            userData.forEach(item => {
              totalHours += parseInt(item.totalActiveTime);
            });

            const firstNameTable = [
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto'],
                body: [
                  [
                    { text: 'NAME', style: 'columnText' },
                    { text: `EMPLOYEE NUMBER`, style: 'columnText' },
                    { text: `DESIGNATION`, style: 'columnText' },
                    { text: `RATE`, style: 'columnText' },
                  ],
                  ...topTable.map((item) => [
                    { text: firstName, style: 'firstNameHeader' },
                    { text: employeeID, style: 'firstNameHeader' },
                    { text: designation, style: 'firstNameHeader' },
                    { text: `$${hourlyRate}`, style: 'firstNameHeader' },
                  ]),
                ],
              },
              layout: {
                hLineWidth: (i, node) => (i === 0 ? 0 : 0), // Hide horizontal lines for rows except header
                vLineWidth: () => 0, // Hide vertical lines
              },
            },
          ];
          documentDefinition.content.push(...firstNameTable);

            const initialDetailsTable = [
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto'],
                body: [
                  [
                    { text: "DATE", style: 'columnText' },
                    { text: "TOTAL TRACKED HOURS", style: 'columnText' },
                    { text: "TOTAL WAGE", style: 'columnText' },
                  ],
                  [
                    { text: '27/7/2022' + ' - ' + '27/7/2023', style: 'columnHeader' },
                    { text: calculateCompleteHours(userData[0].userId, userData), style: 'columnHeader' },
                    { text: `$${calculateTotalWage(userData[0].userId, userData)}`, style: 'columnHeader' },
                  ],
                ],
              },
              layout: {
                hLineWidth: (i, node) => (i === 0 ? 0 : 0), // Hide horizontal lines for rows except header
                vLineWidth: () => 0, // Hide vertical lines
              },
            },
          ];
          documentDefinition.content.push(...initialDetailsTable);
          
          const userTable = [
            {
              margin: [0, 20, 0, 0],
              table: {
                headerRows: 1,
                widths: [
                  'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 
                  'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'
                ],
                body: [
                  [
                    { text: "Week", style: 'employeeTableHeader' },
                    { text: "Day", style: 'employeeTableHeader' },
                    { text: "Date In", style: 'employeeTableHeader' },
                    { text: "Date Out", style: 'employeeTableHeader' },
                    { text: "Time In", style: 'employeeTableHeader' },
                    { text: "Time Out", style: 'employeeTableHeader' },
                    { text: "Department", style: 'employeeTableHeader' },
                    { text: "Status", style: 'employeeTableHeader' },
                    { text: "Hrs:Mins", style: 'employeeTableHeader' },
                    { text: "Hours", style: 'employeeTableHeader' },
                    { text: "Wage", style: 'employeeTableHeader' },
                    { text: "TTL Tracked Hrs", style: 'employeeTableHeader' },
                    { text: "TTL Wages", style: 'employeeTableHeader' },
                    { text: "TTL Break Hrs", style: 'employeeTableHeader' },
                  ],
                  ...userData.reduce((acc, item, index, array) => {
                    const currentWeek = getWeekOfMonth(item.date);
                    const nextItem = array[index + 1];
                    const nextWeek = nextItem ? getWeekOfMonth(nextItem.date) : null;
                    const isEndOfWeek = currentWeek !== nextWeek;
                    const isFirstOfWeek = index === 0 || currentWeek !== getWeekOfMonth(array[index - 1].date);

                    acc.push([
                      { text: isFirstOfWeek ? currentWeek : '', style: 'employeeTableData' },
                      { text: getDayOfWeek(item.date), style: 'employeeTableData' },
                      { text: formatDate(item.logs[0].startTime), style: 'employeeTableData' },
                      { text: formatDate(item.logs[item.logs.length - 1].endTime), style: 'employeeTableData' },
                      { text: item.logs.map(item => formatTime(item.startTime, true)).join('\n') || '-', style: 'employeeTableData' },
                      { text: item.logs.map(item => formatTime(item.endTime, true)).join('\n') || '-', style: 'employeeTableData' },
                      { text: item.logs.map(log => log.derpartment).join('\n') || '-', style: 'employeeTableData' },
                      { text: item.logs.map(log => log.status).join('\n') || '-', style: 'employeeTableData' },
                      { text: item.logs.map(log => calculateTimeDifference(formatTime(log.startTime), formatTime(log.endTime))).join('\n'), style: 'employeeTableData' },
                      { text: item.logs.map(log => calculateTimeDifference(formatTime(log.startTime), formatTime(log.endTime), true)).join('\n') || '-', style: 'employeeTableData' },
                      { text: item.logs.map(log => calculateWage(formatTime(log.startTime), formatTime(log.endTime), log.status, item.rate)).join('\n'), style: 'employeeTableData' },
                      { text: millisecondsToHHMM(item.totalActiveTime), style: {fillColor: '#DFEEF9', fontSize: 9, bold: true, color: '#040404', margin: [0,0,0,5], alignment: 'center'} },
                      { text: item.totalWage, style: {fillColor: '#DFEEF9', fontSize: 9, bold: true, color: '#040404', margin: [0,0,0,5], alignment: 'center'} },
                      { text: millisecondsToHHMM(item.totalBreakTime), style: {fillColor: '#DFEEF9', fontSize: 9, bold: true, color: '#040404', margin: [0,0,0,5], alignment: 'center'} },
                    ]);

                    if (isEndOfWeek) {
                      const weeklyTrackedHours = calculateWeeklyTrackedHours(item.userId, userData);
                      const weeklyBreakHours = calculateWeeklyBreakHours(item.userId, userData);
                      const weeklyWages = calculateWeeklyWage(item.userId, userData);

                      acc.push([
                        { text: 'WK Totals', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: '-', style: 'weeklyTotalRow' },
                        { text: weeklyTrackedHours[currentWeek] || '0:00', style: 'weeklyTotalRow' },
                        { text: `$${weeklyWages[currentWeek]?.toFixed(2)}` || '$0.00', style: 'weeklyTotalRow' },
                        { text: weeklyBreakHours[currentWeek] || '0:00', style: 'weeklyTotalRow' },
                      ]);
                    }

                    return acc;
                  }, []),
                ],
              },
              layout: {
                hLineWidth: () => 0.2,
                vLineWidth: () => 0.2,
                vLineColor: () => '#CCCCCC',
                hLineColor: () => '#CCCCCC',
              },
            },
          ];

          documentDefinition.content.push(...userTable);


            documentDefinition.content.push({ text: '', pageBreak: 'before' });
          }
        }
      }

      // Generate PDF
      const pdfDocGenerator = pdfMake.createPdf(documentDefinition);

      // Check if downloadPdf prop is true
      if (downloadPdf) {
        // Get buffer and create Blob
        pdfDocGenerator.getBuffer((buffer) => {
          const blob = new Blob([buffer], { type: 'application/pdf' });

          // Create download link
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = 'payroll_detail.pdf';
          downloadLink.click();
        });
      }

      // Check if viewPdf prop is true
      if (viewPdf) {
        pdfDocGenerator.open(); // Open PDF in new window
      }
    };

    return null;
  };

  NewPDFDesign.propTypes = {
    dynamicData: PropTypes.array.isRequired,
    downloadPdf: PropTypes.bool,
    viewPdf: PropTypes.bool,
    userId: PropTypes.string // userId is optional
  };
export default NewPDFDesign