// {
//           text: "Name: John Doe",
//           style: {bold: true, fontSize: 12, color: '#4A5056', fillColor: '#518EBD', margin: [0, 0, 16, 0]},
//           absolutePosition: {x: 45, y: 60} // Position the text with 40 units left and 8,units top margin
//         },
//         {
//         table: {
//           headerRows: 1,
//           widths: ['auto', 'auto', 'auto'],
//           body: [
//             [
//               { text: "DATE", style: 'columnHeader' },
//               { text: "REGULAR HRS", style: 'columnHeader' },
//               { text: "RATE", style: 'columnHeader' },
//             ],
//             ...topTable.map((item) => [
//               { text: item.date + ' - ' + '27/7/2023', style: 'columnText' },
//               { text: item.regularHours, style: 'columnText' },
//               { text: item.rate, style: 'columnText' },
//             ]),
//           ],
//         },
//         layout: {
//             hLineWidth: (i, node) => (i === 0 ? 0 : 0), // Hide horizontal lines for rows except header
//             vLineWidth: () => 0, // Hide vertical lines
//           },
//       },
//       {
//         margin: [0, 20, 0, 0],
//         table: {
//           headerRows: 1,
//           widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
//           body: [
//             [
//               { text: "Date", style: 'employeeTableHeader' },
//               { text: "Start time", style: 'employeeTableHeader' },
//               { text: "End Time", style: 'employeeTableHeader' },
//               { text: "Department ID", style: 'employeeTableHeader' },
//               { text: "Status", style: 'employeeTableHeader' },
//               { text: "Hours", style: 'employeeTableHeader' },
//               { text: "Role", style: 'employeeTableHeader' },
//             ],
//             ...data.map((item) => [
//               { text: item.date, style: 'employeeTableData' },
//               { text: item.startTime, style: { employeeTableData: true, fillColor: '#F2F2F2' } },
//               { text: item.endTime, style: { employeeTableData: true, fillColor: '#F2F2F2' } },
//               { text: item.departmentId, style: 'employeeTableData' },
//               { text: item.status, style: 'employeeTableData' },
//               { text: item.hours, style: { employeeTableData: true, fillColor: '#DFEEF9' } },
//               { text: item.role, style: 'employeeTableData' },
//             ]),
//             [
//               { text: 'Total', style: {alignment: 'right', margin: [0, 0, 16, 0], fontSize: 12, fillColor: '#DFEEF9', color: '#386384', bold: true} },
//               { text: '---', style: 'lastRowTotal' },
//               { text: '---', style: 'lastRowTotal' },
//               { text: '---', style: 'lastRowTotal' },
//               { text: '---', style: 'lastRowTotal' },
//               { text: 40, style: 'lastRowTotal' },
//               { text: '---', style: 'lastRowTotal' },
//             ],
//           ],
//         },
//         layout: {
//             hLineWidth: () => 0.2, // Hide horizontal lines for rows except header
//             vLineWidth: () => 0.2,
//             vLineColor: () => '#CCCCCC',
//             hLineColor: () => '#CCCCCC',
//           },
//       },
//       {
//           canvas: [
//             {
//               type: 'rect',
//               x: 0,
//               y: 420,
//               w: 160, // Width of A4 page in PDF units
//               h: 0.5, // Height of A4 page in PDF units
//               color: '#4D5358', // Background color of the rectangle
//             },
//           ],
//           absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
//       },
//       {
//           canvas: [
//             {
//               type: 'rect',
//               x: 180,
//               y: 420,
//               w: 110, // Width of A4 page in PDF units
//               h: 0.5, // Height of A4 page in PDF units
//               color: '#4D5358', // Background color of the rectangle
//             },
//           ],
//           absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
//       },
//       {
//           canvas: [
//             {
//               type: 'rect',
//               x: 400,
//               y: 420,
//               w: 110, // Width of A4 page in PDF units
//               h: 1, // Height of A4 page in PDF units
//               color: '#DFEEF9', // Background color of the rectangle
//             },
//           ],
//           absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
//       },
//       {
//           canvas: [
//             {
//               type: 'rect',
//               x: 400,
//               y: 490,
//               w: 110, // Width of A4 page in PDF units
//               h: 1, // Height of A4 page in PDF units
//               color: '#DFEEF9', // Background color of the rectangle
//             },
//           ],
//           absolutePosition: {x: 40, y: 20}, // Position the canvas at the top left corner
//       },
//       {
//         text: "SUPERVISOR SIGNATURE",
//         style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 40, y: 445} // Position the text with 40 units left and 8,units top margin
//       },
//       {
//         text: "DATE",
//         style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 220, y: 445} // Position the text with 40 units left and 10 units top margin
//       },
//       {
//         text: "TOTAL HOURS",
//         style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 485, y: 445} // Position the text with 40 units left and 10 units top margin
//       },
//       {
//         text: "0.00",
//         style: {bold: true, fontSize: 11, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 528, y: 425} // Position the text with 40 units left and 10 units top margin
//       },
//       {
//         text: "Automate your timesheets with My Hours - it's Free",
//         style: {bold: true, fontSize: 11, color: '#5BB769', fontWeight: 'bolder', decoration: 'underline'},
//         absolutePosition: {x: 40, y: 500} // Position the text with 40 units left and 10 units top margin
//       },
//       {
//         text: "$0.00",
//         style: {bold: true, fontSize: 11, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 522, y: 495} // Position the text with 40 units left and 10 units top margin
//       },
//       {
//         text: "TOTAL PAYROLL",
//         style: {bold: true, fontSize: 10, color: '#4A5056', fontWeight: 'bolder'},
//         absolutePosition: {x: 475, y: 515} // Position the text with 40 units left and 10 units top margin
//       },