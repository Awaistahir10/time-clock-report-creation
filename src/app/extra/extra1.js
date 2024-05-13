//For multiple users
  // const formatDataForCSV = () => {
  //   const formattedData = [];
  //   const groupedData = {};

  //   usersData.forEach(item => {
  //     const userId = item.user.id;
  //     if (!groupedData[userId]) {
  //       groupedData[userId] = [];
  //     }
  //     groupedData[userId].push(item);
  //   });

  //   for (const userId in groupedData) {
  //     if (groupedData.hasOwnProperty(userId)) {
  //       const userData = groupedData[userId];
  //       let totalHours = 0;

  //       const userRows = userData.map(item => {
  //         totalHours += parseFloat(item.activeTime);

  //         return {
  //           "Date": item.date,
  //           "Time In": item.logs[0]?.startTime ? formatTime(item.logs[0].startTime) : '-',
  //           "Time Out": item.logs[item.logs.length - 1]?.endTime ? formatTime(item.logs[item.logs.length - 1].endTime) : '-',
  //           "Department": item.workedDepartment || "-",
  //           "Status": item.currentStatus || "-",
  //           "Hours": millisecondsToHHMM(item.activeTime),
  //           "Role": item.user.organizationRole || "-",
  //         };
  //       });

  //       formattedData.push(...userRows, {
  //         "Date": "",
  //         "Time In": "",
  //         "Time Out": "",
  //         "Department": "",
  //         "Status": "",
  //         "Hours": `Total Hours Worked: ${millisecondsToHHMM(totalHours)}`,
  //         "Role": "",
  //       });
  //     }
  //   }

  //   return formattedData;
  // };