export const pdfStyles = {
  heading: {
    fontSize: 20,
    bold: true,
    alignment: 'center',
    margin: [0, 0, 0, 20], // Add margin below the heading
  },
  subHeading: {
    fontSize: 15,
    alignment: 'center',
    margin: [0, 0, 0, 20], // Add margin below the subheading
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    color: 'black', // Set color to black
    margin: [0, 5, 90, 0], // Add margin to separate header from content
    border: [false, false, false, true], // Bottom border only
  },
  tableData: {
    fontSize: 10,
    margin: [0, 5, 0, 0], // Add margin to separate header from content
    border: [false, false, false, false], // No borders
  },
  userHeader: {
    fontSize: 12,
    bold: true,
    alignment: 'left',
    margin: [0, 10, 0, 5], // Add margin below the user header
  },
  tableHeaderForSingleUser: {
    bold: true,
    fontSize: 12,
    color: 'black', // Set color to black
    margin: [0, 0, 0, 70], // Add margin to separate header from content
    border: [false, false, false, true], // Bottom border only
  },
  tableHeaderForHours: {
    bold: true,
    fontSize: 12,
    color: 'black', // Set color to black
    margin: [80, 0, 0, 70], // Add margin to separate header from content
    border: [false, false, false, true], // Bottom border only
  },
  tableDataForHours: {
    fontSize: 10,
    margin: [80, 0, 0, 0], // Add margin to separate header from content
    border: [false, false, false, false], // No borders
  },
  spaceForTableRows: {
    margin: [0, 5, 0, 0], // Add margin to separate header from content
  }
};