import React, { useEffect } from 'react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import { millisecondsToHHMM } from '@/app/utils/millisecondsToHHMM';
import { formatTime } from '@/app/utils/formatTime';
import { pdfStyles } from '@/app/constants/pdfStyles';
import { tableData } from '@/app/constants/users';

// Register fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFGenerator = ({ dynamicData, downloadPdf, viewPdf, userId }) => {

  useEffect(() => {
    generatePDF(downloadPdf, viewPdf);
  }, [downloadPdf, viewPdf]);

  const generatePDF = () => {
    const documentDefinition = {
      content: [
        { text: userId ? `Payroll Details` : `Payroll Summary`, style: 'heading' },
        { text: `For the period of 12/12/23 to 12/12/24`, style: 'subHeading' },
      ],
      styles: pdfStyles,
      pageSize: 'A4', // Set page size
      pageOrientation: userId ? 'landscape' : 'portrait'
    };

    if (userId) {
      // If userId is provided, generate PDF for single user
      const userData = dynamicData.filter(item => item.user.id === userId);

      if (userData.length > 0) {
        // Calculate total hours worked for the user

        const firstName = userData[0].user.firstName;

        let totalHours = 0;
        userData.forEach(item => {
          totalHours += parseInt(item.activeTime);
        });

        const userTable = [
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                // Table header
                [
                  { text: 'Week', style: 'tableHeaderForSingleUser' },
                  { text: 'Day', style: 'tableHeaderForSingleUser' },
                  { text: 'Date In', style: 'tableHeaderForSingleUser' },
                  { text: 'Time In', style: 'tableHeaderForSingleUser' },
                  { text: 'Date Out', style: 'tableHeaderForSingleUser' },
                  { text: 'Time Out', style: 'tableHeaderForSingleUser' },
                  { text: 'Break', style: 'tableHeaderForSingleUser' },
                  { text: 'Hours', style: 'tableHeaderForHours' },
                ],
                // Map userData to table rows with increased spacing between weeks
                ...tableData.flatMap((item, index, array) => {
                  const row = [
                    { text: item.week, style: 'tableData' },
                    { text: item.day, style: 'tableData' },
                    { text: item.dateIn, style: 'tableData' },
                    { text: item.timeIn, style: 'tableData' },
                    { text: item.dateOut, style: 'tableData' },
                    { text: item.timeOut, style: 'tableData' },
                    { text: item.breakVal, style: 'tableData' },
                    { text: item.hours, style: 'tableDataForHours' },
                  ];
                  const isLastInWeek = index === array.length - 1 || item.week !== array[index + 1].week;
                  return isLastInWeek ? [row, [{ text: '', colSpan: 8, margin: [0, 20, 0, 20] }]] : [row];
                }),
              ],
            },
            layout: {
              hLineWidth: () => 0, // Hide all horizontal lines
              vLineWidth: () => 0, // Hide all vertical lines
              paddingLeft: () => 0, // No padding on the left
              paddingRight: () => 0, // No padding on the right
              paddingTop: () => 0, // No padding on the top
              paddingBottom: () => 0, // No padding on the bottom
            },
          },
          {
            canvas: [
              {
                type: 'rect',
                x: 0,
                y: 115,
                w: 750, // Width of A4 page in PDF units
                h: 1, // Height of A4 page in PDF units
                color: 'black', // Background color of the rectangle
              },
            ],
            absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
          },
          {
            text: firstName,
            style: { bold: true, fontSize: 11, color: 'black', fontWeight: 'bolder' },
            absolutePosition: { x: 277, y: 160 }, // Position the text with 40 units left and 8 units top margin
          },
          {
            text: "Number: 999",
            style: { bold: true, fontSize: 11, color: 'black', fontWeight: 'bolder' },
            absolutePosition: { x: 360, y: 160 }, // Position the text with 40 units left and 8 units top margin
          },
          {
            text: "Employee",
            style: { bold: true, fontSize: 11, color: 'black', fontWeight: 'bolder' },
            absolutePosition: { x: 490, y: 160 }, // Position the text with 40 units left and 8 units top margin
          },
          {
            text: "Manager",
            style: { bold: true, fontSize: 11, color: 'black', fontWeight: 'bolder' },
            absolutePosition: { x: 490, y: 190 }, // Position the text with 40 units left and 8 units top margin
          },
          {
            canvas: [
              {
                type: 'rect',
                x: 505,
                y: 150,
                w: 245, // Width of A4 page in PDF units
                h: 0.5, // Height of A4 page in PDF units
                color: 'black', // Background color of the rectangle
              },
            ],
            absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
          },
          {
            canvas: [
              {
                type: 'rect',
                x: 505,
                y: 180,
                w: 245, // Width of A4 page in PDF units
                h: 0.5, // Height of A4 page in PDF units
                color: 'black', // Background color of the rectangle
              },
            ],
            absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
          },
          {
            canvas: [
              {
                type: 'rect',
                x: 330,
                y: 220,
                w: 420, // Width of A4 page in PDF units
                h: 0.5, // Height of A4 page in PDF units
                color: 'black', // Background color of the rectangle
              },
            ],
            absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
          },
          {
            text: "16:00",
            style: { fontSize: 10 },
            absolutePosition: { x: 380, y: 250 }, // Position the text with 40 units left and 8 units top margin
          },
          {
            canvas: [
              {
                type: 'rect',
                x: 330,
                y: 220+75,
                w: 420, // Width of A4 page in PDF units
                h: 0.5, // Height of A4 page in PDF units
                color: 'black', // Background color of the rectangle
              },
            ],
            absolutePosition: { x: 40, y: 20 }, // Position the canvas at the top left corner
          },
        ];
        documentDefinition.content.push(...userTable);
      }
    } else {
      // If userId is not provided, generate PDF for all users
      // Group dynamicData by user IDs
      const groupedData = {};
      dynamicData.forEach(item => {
        const userId = item.user.id;
        if (!groupedData[userId]) {
          groupedData[userId] = [];
        }
        groupedData[userId].push(item);
      });

      // Generate a single table for all users
      const allUserTable = [
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto'],
            body: [
              // Table header with bottom border
              [
                { text: 'Name', style: 'tableHeader' },
                { text: 'Employee Number', style: 'tableHeader' },
                { text: 'Hours:Minutes', style: 'tableHeader' },
              ],
              // Map groupedData to table rows for each user
              ...Object.values(groupedData).flatMap(userData => {
                const firstName = userData[0].user.firstName;
                return userData.map(item => {
                  // Extract relevant information from the item
                  const name = firstName;
                  const employeeNumber = 999;
                  const hours = millisecondsToHHMM(item.activeTime);

                  // Return the row data
                  return [
                    name,
                    employeeNumber,
                    hours,
                  ];
                });
              }),
            ],
          },
          layout: {
            hLineWidth: () => 0, // Hide horizontal lines for rows
            vLineWidth: () => 0, // Hide vertical lines
            hLineColor: (i, node) => (i === 1 ? 'black' : 'gray'), // Custom bottom border color for header and rows
            hLineWidth: (i, node) => 1, // Apply a bottom border to each row
          },
        },
      ];

      documentDefinition.content.push(...allUserTable);
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

PDFGenerator.propTypes = {
  dynamicData: PropTypes.array.isRequired,
  downloadPdf: PropTypes.bool,
  viewPdf: PropTypes.bool,
  userId: PropTypes.string // userId is optional
};

export default PDFGenerator;
