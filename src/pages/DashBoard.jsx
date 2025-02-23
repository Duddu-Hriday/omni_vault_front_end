import React from 'react';
import FileUploader from './FileUploader1';
import FileList from './FileList';

const DashBoard = () => {
  const userEmail = localStorage.getItem('email'); // Assuming email is stored in localStorage after login

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>

        {/* File Upload Card */}
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Upload Your Files</h2>
          <FileUploader />
        </div>

        {/* File List */}
        <FileList userEmail={userEmail} />
      </div>
    </div>
  );
};

export default DashBoard;
