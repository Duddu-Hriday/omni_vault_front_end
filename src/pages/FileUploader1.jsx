import React, { useState } from 'react';

const FileUploader = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus('');
  };

  const handleUpload = async () => {
    // Assume token is stored in localStorage after login
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // console.log(token);
    if (!token) {
      alert("Please log in to upload files.");
      return;
    }

    if (!file) {
      setUploadStatus('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      const res = await fetch('http://localhost:5000/api/files/upload', {
        method: 'POST',
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setUploadStatus('File uploaded successfully!');
        onFileUpload && onFileUpload(result);
      } else {
        setUploadStatus(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      setUploadStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg flex flex-col items-center space-y-4">
      <h2 className="text-xl font-bold text-gray-700">Upload a File</h2>
      <input
        type="file"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Upload
      </button>
      {uploadStatus && (
        <p className={`text-sm ${uploadStatus.startsWith('F') ? 'text-green-600' : 'text-red-600'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  );
};

export default FileUploader;
