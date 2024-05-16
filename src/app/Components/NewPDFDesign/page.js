import React, { useEffect } from 'react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import { newPdfStyles } from '@/app/constants/newPdfStyles';
import { data, topTable } from '@/app/constants/users';
import { formatTime } from '@/app/utils/formatTime';
import { millisecondsToHHMM } from '@/app/utils/millisecondsToHHMM';

// Register fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const NewPDFDesign = ({ dynamicData, downloadPdf, viewPdf, userId }) => {

  useEffect(() => {
    console.log('d1', dynamicData)
    generatePDF(downloadPdf, viewPdf);
  }, [downloadPdf, viewPdf]);

  const generatePDF = () => {
         
    const documentDefinition = {
      content: [
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 500, // Width of A4 page in PDF units
              h: 30, // Height of A4 page in PDF units
              color: '#DFEEF9', // Background color of the rectangle
            },
          ],
          absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
        },
        {
          text: "Payroll Details",
          style: 'heading',
          absolutePosition: { x: 45, y: 25 } // Position the text with 40 units left and 10 units top margin
        },
      ],
      styles: newPdfStyles,
      pageMargins: [40, 60, 40, 60], // Define margins for all sides
      pageSize: 'A4', // Set page size
    };

    if (userId) {
      // If userId is provided, generate PDF for single user
      const userData = dynamicData.filter(item => item.user.id === userId);

      if (userData.length > 0) {
        // Calculate total hours worked for the user

        const firstName = userData[0].user.firstName;

        // Add the first name above the table header line
        documentDefinition.content.push({
          text: `Name: ${firstName}`,
          style: { bold: true, fontSize: 12, color: '#4A5056', fillColor: '#518EBD', margin: [0, 0, 16, 0] },
          absolutePosition: { x: 45, y: 60 }
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
                  { text: item.logs.map(item => formatTime(item.startTime)).join('\n') || '-', style: { employeeTableData: true, fillColor: '#F2F2F2' } },
                  { text: item.logs.map(item => formatTime(item.endTime)).join('\n') || '-', style: { employeeTableData: true, fillColor: '#F2F2F2' } },
                  { text: item.logs.map(log => log.departmentId.slice(0, -5)) || '-', style: 'employeeTableData' },
                  { text: item.currentStatus || '-', style: 'employeeTableData' },
                  { text: millisecondsToHHMM(item.activeTime), style: { employeeTableData: true, fillColor: '#DFEEF9' } },
                  { text: item.user.organizationRole || '-', style: 'employeeTableData' },
                ]),
                [
                  { text: 'Total', style: {alignment: 'right', margin: [0, 0, 16, 0], fontSize: 12, fillColor: '#DFEEF9', color: '#386384', bold: true} },
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
              {
              canvas: [
                {
                  type: 'rect',
                  x: 0,
                  y: 420,
                  w: 160, // Width of A4 page in PDF units
                  h: 0.5, // Height of A4 page in PDF units
                  color: '#4D5358', // Background color of the rectangle
                },
              ],
              absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
          },
          {
              canvas: [
                {
                  type: 'rect',
                  x: 180,
                  y: 420,
                  w: 110, // Width of A4 page in PDF units
                  h: 0.5, // Height of A4 page in PDF units
                  color: '#4D5358', // Background color of the rectangle
                },
              ],
              absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
          },
          {
              canvas: [
                {
                  type: 'rect',
                  x: 400,
                  y: 420,
                  w: 110, // Width of A4 page in PDF units
                  h: 1, // Height of A4 page in PDF units
                  color: '#DFEEF9', // Background color of the rectangle
                },
              ],
              absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
          },
          {
              canvas: [
                {
                  type: 'rect',
                  x: 400,
                  y: 490,
                  w: 110, // Width of A4 page in PDF units
                  h: 1, // Height of A4 page in PDF units
                  color: '#DFEEF9', // Background color of the rectangle
                },
              ],
              absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
          },
          {
            text: "SUPERVISOR SIGNATURE",
            style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 40, y: 445} // Position the text with 40 units left and 8,units top margin
          },
          {
            text: "DATE",
            style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 220, y: 445} // Position the text with 40 units left and 10 units top margin
          },
          {
            text: "TOTAL HOURS",
            style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 485, y: 445} // Position the text with 40 units left and 10 units top margin
          },
          {
            text: millisecondsToHHMM(totalHours),
            style: {bold: true, fontSize: 11, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 528, y: 425} // Position the text with 40 units left and 10 units top margin
          },
          {
            text: "Automate your timesheets with My Hours - it's Free",
            style: {bold: true, fontSize: 11, color: '#5BB769', fontWeight: 'bolder', decoration: 'underline'},
            absolutePosition: {x: 40, y: 500} // Position the text with 40 units left and 10 units top margin
          },
          {
            text: "$40.00",
            style: {bold: true, fontSize: 11, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 522, y: 495} // Position the text with 40 units left and 10 units top margin
          },
          {
            text: "TOTAL PAYROLL",
            style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
            absolutePosition: {x: 475, y: 515} // Position the text with 40 units left and 10 units top margin
          },
        ]

        documentDefinition.content.push(...userTable);

      } else {
        documentDefinition.content.push({ text: 'Hello Else!', style: 'helloText', absolutePosition: { x: 40, y: 80 } }); // Position the text with 40 units left and 80 units top margin
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
}
export default NewPDFDesign