const { formatTime } = require("./formatTime");
const { millisecondsToHHMM } = require("./millisecondsToHHMM");

export const formatDataForCSV = (usersData, userId = null) => {
  const formattedData = [];

  if (userId) {
    // Find the user data based on the provided userId
    const userData = usersData.find(item => item.user.id === userId);
    if (!userData) {
      return formattedData; // Return empty array if user data not found
    }

    const { logs, date, user } = userData;

    // Extract user details
    const { organizationRole } = user;

    // Map logs data to desired format
    const userRows = logs.map(log => ({
      "Date": date,
      "Time In": log.startTime ? formatTime(log.startTime) : '-',
      "Time Out": log.endTime ? formatTime(log.endTime) : '-',
      "Department ID": log.departmentId ? log.departmentId : '-',
      "Status": log.status || "-",
      "Role": organizationRole || "-",
    }));

    // Push the formatted logs data to the formattedData array
    formattedData.push(...userRows);
  } else {
    // For multiple users
    const groupedData = {};

    usersData.forEach(item => {
      const userId = item.user.id;
      if (!groupedData[userId]) {
        groupedData[userId] = [];
      }
      groupedData[userId].push(item);
    });

    for (const userId in groupedData) {
      if (groupedData.hasOwnProperty(userId)) {
        const userData = groupedData[userId];
        let totalHours = 0;

        const userRows = userData.map(item => {
          totalHours += parseFloat(item.activeTime);

          return {
            "Date": item.date,
            "Time In": item.logs[0]?.startTime ? formatTime(item.logs[0].startTime) : '-',
            "Time Out": item.logs[item.logs.length - 1]?.endTime ? formatTime(item.logs[item.logs.length - 1].endTime) : '-',
            "Department": item.workedDepartment || "-",
            "Status": item.currentStatus || "-",
            "Hours": millisecondsToHHMM(item.activeTime),
            "Role": item.user.organizationRole || "-",
          };
        });

        formattedData.push(...userRows);

        // Append total hours row for each user
        formattedData.push({
          "Date": "",
          "Time In": "",
          "Time Out": "",
          "Department": "",
          "Status": "",
          "Hours": `Total Hours Worked: ${millisecondsToHHMM(totalHours)}`,
          "Role": "",
        });
      }
    }
  }

  return formattedData;
};
