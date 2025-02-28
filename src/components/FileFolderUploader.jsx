import React, { useState } from "react";

const FileFolderUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolderFiles, setSelectedFolderFiles] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  // Reusable Button component
  const Button = ({ children, onClick, className, disabled }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );

  // Handle multiple file selection (not folders)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  // Handle folder selection
  const handleFolderChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFolderFiles(files);
  };

  // Upload function (reusable for both files and folders)
  const handleUpload = async (filesToUpload) => {
    if (filesToUpload.length === 0) {
      alert('Upload files required')
      return};

    setLoading(true); // Start loading
    const formData = new FormData();
    filesToUpload.forEach((file) => formData.append("files", file)); // "files" matches backend multer field

    try {
      const token = sessionStorage.getItem("token"); // Firebase token from sessionStorage

      const response = await fetch("http://localhost:5000/api/upload/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        // alert("Files uploaded successfully!");
        console.log("Uploaded Data:", result);
        setSelectedFiles([]);
        setSelectedFolderFiles([]);
        window.location.reload(); // Refresh the page after successful upload
      } else {
        alert(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-4 border rounded shadow-md space-y-6 relative">
      {/* Fullscreen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4 text-lg">Uploading...</p>
          </div>
        </div>
      )}

      {/* Folder Uploader */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Folder</h2>
        <input
          type="file"
          multiple
          webkitdirectory="true"
          mozdirectory="true"
          onChange={handleFolderChange}
          className="mb-4"
        />
        <Button onClick={() => handleUpload(selectedFolderFiles)}>
          Upload Folder
        </Button>
      </div>

      {/* File Uploader */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Multiple Files</h2>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="mb-4"
        />
        <Button onClick={() => handleUpload(selectedFiles)}>
          Upload Files
        </Button>
      </div>
    </div>
  );
};

export default FileFolderUploader;
