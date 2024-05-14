import { formatTime } from "./formatTime";
import { millisecondsToHHMM } from "./millisecondsToHHMM";

export const formatDataForCSV = (usersData, userId = null) => {
  const formattedData = [];

  if (userId) {
    const userData = usersData.find(item => item.user.id === userId);
    if (!userData) {
      return formattedData;
    }

    const { logs, date, user, activeTime } = userData;
    const { organizationRole } = user;

    const userRows = logs.map(log => ({
      "Date": date,
      "Time In": log.startTime ? formatTime(log.startTime) : '-',
      "Time Out": log.endTime ? formatTime(log.endTime) : '-',
      "Department ID": log.departmentId ? log.departmentId : '-',
      "Status": log.status || "-",
      "Role": organizationRole || "-",
      "Hours": millisecondsToHHMM(activeTime),
    }));

    formattedData.push(...userRows);
  } else {
    const groupedData = {};
    let totalHours = 0;

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
            "Department ID": item.workedDepartment || "-",
            "Status": item.currentStatus || "-",
            "Hours": millisecondsToHHMM(item.activeTime),
            "Role": item.user.organizationRole || "-",
          };
        });

        formattedData.push(...userRows, {
          "Date": "",
          "Time In": "",
          "Time Out": "",
          "Department ID": "",
          "Status": "",
          "Hours": `Total Hours Worked: ${millisecondsToHHMM(totalHours)}`,
          "Role": "",
        });
      }
    }
  }

  return formattedData;
};
