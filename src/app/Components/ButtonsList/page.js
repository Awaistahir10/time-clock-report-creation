"use client"

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import { headers } from '@/app/constants/csvHeaders';
import PDFGenerator from '../PDFGenerator/page';
import { formatDataForCSV } from '@/app/utils/formatDataForCSV';

const ButtonsList = () => {
  const [showView, setShowView] = useState(false);
  const [downloadFile, setDownloadFile] = useState(false);
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    handleUserApi();
  }, []);

  const handleUserApi = async () => {
    const response = await axios.get('https://jsonblob.com/api/1238435875020201984');
    const updatedData = [...response.data.timeTracking];
    updatedData[2].activeTime = 18779000; // Updated activeTime for the third index
    console.log(updatedData);
    setUsersData(updatedData);
  };


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
      <PDFGenerator userId="663892498ab0f40742540fb2" dynamicData={usersData} viewPdf={showView} downloadPdf={downloadFile} />
      <button onClick={handleViewClick} className='bg-red-500 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-xl rounded-full text-white'>View PDF</button>
      <button onClick={handleDownloadClick} className='bg-red-800 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-lg rounded-full text-white'>Download PDF</button>
      {usersData.length > 0 && (
        <CSVLink className='bg-green-500 transition-all hover:opacity-80 w-[10rem] h-[4rem] text-lg rounded-full text-white flex justify-center items-center' data={formatDataForCSV(usersData, "663892498ab0f40742540fb2")} headers={headers}>Download CSV</CSVLink>
      )}
    </div>
  );
};

export default ButtonsList;
