"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import PDFTemplate from '../PDFTemplate/page';
import PDFForSingleUser from '../PDFForSingleUser/page';

const FileList = () => {
  const [showView, setShowView] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    handleUserApi();
  }, []);

  const millisecondsToHHMM = (milliseconds) => {
    // Convert milliseconds to seconds
    const seconds = milliseconds / 1000;

    // Calculate hours and minutes
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    // Format the result as HH:MM
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
  };
  
  const calculateHours = (timeIn, timeOut) => {
    if (!timeIn || !timeOut) {
      return "-";
    }

    const startTime = Array.isArray(timeIn) ? timeIn[0] : timeIn;
    const endTime = Array.isArray(timeOut) ? timeOut[timeOut.length - 1] : timeOut;

    const [hoursIn, minutesIn, ampmIn] = startTime.split(/[:\s]/);
    const [hoursOut, minutesOut, ampmOut] = endTime.split(/[:\s]/);

    let startHour = parseInt(hoursIn, 10);
    let endHour = parseInt(hoursOut, 10);

    if (ampmIn === 'PM' && startHour !== 12) {
      startHour += 12;
    }
    if (ampmOut === 'PM' && endHour !== 12) {
      endHour += 12;
    }

    const startMinute = parseInt(minutesIn, 10);
    const endMinute = parseInt(minutesOut, 10);

    const startTimeMs = new Date(0, 0, 0, startHour, startMinute).getTime();
    const endTimeMs = new Date(0, 0, 0, endHour, endMinute).getTime();
    const differenceMs = endTimeMs - startTimeMs;

    const hours = differenceMs / (1000 * 60 * 60);

    return hours.toFixed(2);
  };

  const formatTime = (timeString) => {
    const time = new Date(timeString);
    const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
  };

  const handleUserApi = async () => {
    const response = await axios.get('https://jsonblob.com/api/1238435875020201984');
    const updatedData = [...response.data.timeTracking];
    updatedData[2].activeTime = 18779000; // Updated activeTime for the third index
    console.log(updatedData);
    setUsersData(updatedData);
  };

  const formatDataForCSV = (userId) => {
  const formattedData = [];
  
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

  return formattedData;
};


  const headers = [
    { label: "Date", key: "Date" },
    { label: "Time In", key: "Time In" },
    { label: "Time Out", key: "Time Out" },
    { label: "Department ID", key: "Department ID" },
    { label: "Status", key: "Status" },
    { label: "Role", key: "Role" },
  ];

  const handleViewClick = () => {
    setShowView(true);
    setDownloadFile(false);
  };

  const handleDownloadClick = () => {
    setDownloadFile(true);
    setShowView(false);
  };

  return (
    <div className='w-full h-screen flex justify-center items-center gap-4'>
      {/* <PDFTemplate dynamicData={usersData} viewPdf={showView} downloadPdf={downloadFile} /> */}
      <PDFForSingleUser userId={"663caf71bc14cfb681e6ce3c"} dynamicData={usersData} viewPdf={showView} downloadPdf={downloadFile} />
      <button onClick={handleViewClick} className='bg-red-500 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-xl rounded-full text-white'>View PDF</button>
      <button onClick={handleDownloadClick} className='bg-red-800 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-lg rounded-full text-white'>Download PDF</button>
      {usersData.length > 0 && (
        <CSVLink className='bg-green-500 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-lg rounded-full text-white flex justify-center items-center' data={formatDataForCSV("663892498ab0f40742540fb2")} headers={headers}>Download CSV</CSVLink>
      )}
    </div>
  );
};

export default FileList;
