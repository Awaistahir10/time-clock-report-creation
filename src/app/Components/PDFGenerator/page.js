import React, { useEffect } from 'react';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import PropTypes from 'prop-types';
import { millisecondsToHHMM } from '@/app/utils/millisecondsToHHMM';
import { formatTime } from '@/app/utils/formatTime';
import { pdfStyles } from '@/app/constants/pdfStyles';

// Register fonts with pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const PDFGenerator = ({ dynamicData, downloadPdf, viewPdf, userId }) => {

  useEffect(() => {
    generatePDF(downloadPdf, viewPdf);
  }, [downloadPdf, viewPdf]);

  const generatePDF = () => {
    const documentDefinition = {
      content: [
        { text: `Payroll Details`, style: 'heading' },
        { text: `For the period of 12/12/23 to 12/12/24`, style: 'subHeading' },
      ],
      styles: pdfStyles,
    };

    if (userId) {
      // If userId is provided, generate PDF for single user
      const userData = dynamicData.filter(item => item.user.id === userId);

      if (userData.length > 0) {
        // Calculate total hours worked for the user

        const firstName = userData[0].user.firstName;

        // Add the first name above the table header line
        documentDefinition.content.push({ text: `Name: ${firstName}`, style: 'userHeader' });
        let totalHours = 0;
        userData.forEach(item => {
          totalHours += parseInt(item.activeTime);
        });

        const userTable = [
          {
            table: {
              headerRows: 1,
              widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
              body: [
                // Table header with bottom border
                [
                  { text: 'Date', style: 'tableHeader' },
                  { text: 'Start Time', style: 'tableHeader' },
                  { text: 'End Time', style: 'tableHeader' },
                  { text: 'Department ID', style: 'tableHeader' },
                  { text: 'Status', style: 'tableHeader' },
                  { text: 'Hours', style: 'tableHeader' },
                  { text: 'Role', style: 'tableHeader' },
                ],
                // Map userData to table rows
                ...userData.map(item => {
                  // Extract relevant information from the item
                  const date = item.date;
                  const timeIn = item.logs.map(item => formatTime(item.startTime)) || '-';
                  const timeOut = item.logs.map(item => formatTime(item.endTime)) || '-';
                  const department = item.logs.map(item => item.departmentId) || '-';
                  const status = item.currentStatus || '-';
                  // Calculate hours based on timeIn and timeOut
                  const hours = millisecondsToHHMM(item.activeTime);
                  // Dummy values for reg, replace with actual data if available
                  const reg = item.user.organizationRole;

                  // Return the row data
                  return [
                    date,
                    timeIn,
                    timeOut,
                    department,
                    status,
                    hours,
                    reg,
                  ];
                }),
              ],
            },
            layout: {
              hLineWidth: (i, node) => (i === 0 ? 1 : 0), // Hide horizontal lines for rows except header
              vLineWidth: () => 0, // Hide vertical lines
            },
          },
          {
            // Line separator
            canvas: [{ type: 'line', x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1 }],
            margin: [0, 5, 0, 5] // Add margin to separate line from next user table
          },
          {
            // Total hours row for the user
            columns: [
              { text: 'Total Hours Worked: ', alignment: 'right', bold: true },
              { text: millisecondsToHHMM(totalHours), alignment: 'left', bold: true }
            ],
            margin: [0, 20, 0, 0] // Add margin to separate total hours row from the table
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

      // Generate table for each user
      for (const userId in groupedData) {
        if (groupedData.hasOwnProperty(userId)) {
          const userData = groupedData[userId];

          const firstName = userData[0].user.firstName;

          // Add the first name above the table header line
          documentDefinition.content.push({ text: `Name: ${firstName}`, style: 'userHeader' });

          // Calculate total hours worked for the user
          let totalHours = 0;
          userData.forEach(item => {
            totalHours += parseInt(item.activeTime);
          });

          const userTable = [
            {
              table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                  // Table header with bottom border
                  [
                    { text: 'Date', style: 'tableHeader' },
                    { text: 'Time In', style: 'tableHeader' },
                    { text: 'Time Out', style: 'tableHeader' },
                    { text: 'Department', style: 'tableHeader' },
                    { text: 'Status', style: 'tableHeader' },
                    { text: 'Hours', style: 'tableHeader' },
                    { text: 'Role', style: 'tableHeader' },
                  ],
                  // Map userData to table rows
                  ...userData.map(item => {
                    // Extract relevant information from the item
                    const date = item.date;
                    const timeIn = item.logs[0]?.startTime ? formatTime(item.logs[0].startTime) : '-';
                    const timeOut = item.logs[item.logs.length - 1]?.endTime ? formatTime(item.logs[item.logs.length - 1].endTime) : '-';
                    const department = item.workedDepartment || '-';
                    const status = item.currentStatus || '-';
                    // Calculate hours based on timeIn and timeOut
                    const hours = millisecondsToHHMM(item.activeTime);
                    // Dummy values for reg, replace with actual data if available
                    const reg = item.user.organizationRole;

                    // Return the row data
                    return [
                      date,
                      timeIn,
                      timeOut,
                      department,
                      status,
                      hours,
                      reg,
                    ];
                  }),
                ],
              },
              layout: {
                hLineWidth: (i, node) => (i === 0 ? 1 : 0), // Hide horizontal lines for rows except header
                vLineWidth: () => 0, // Hide vertical lines
              },
            },
            {
              // Line separator
              canvas: [{ type: 'line', x1: 0, y1: 5, x2: 520, y2: 5, lineWidth: 1 }],
              margin: [0, 5, 0, 5] // Add margin to separate line from next user table
            },
            {
              // Total hours row for the user
              columns: [
                { text: 'Total Hours Worked: ', alignment: 'right', bold: true },
                { text: millisecondsToHHMM(totalHours), alignment: 'left', bold: true }
              ],
              margin: [0, 20, 0, 0] // Add margin to separate total hours row from the table
            },
          ];

          documentDefinition.content.push(...userTable);
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

PDFGenerator.propTypes = {
  dynamicData: PropTypes.array.isRequired,
  downloadPdf: PropTypes.bool,
  viewPdf: PropTypes.bool,
  userId: PropTypes.string // userId is optional
};

export default PDFGenerator;
