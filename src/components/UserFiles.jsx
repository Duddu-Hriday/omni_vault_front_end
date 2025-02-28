import React, { useEffect, useState } from "react";

const UserFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFile1, setLoadingFile1] = useState({}); // Track loading state for individual files
  const [loadingFile2, setLoadingFile2] = useState({}); // Track loading state for individual files
  const [loadingFile3, setLoadingFile3] = useState({}); // Track loading state for individual files
  const [loadingFile4, setLoadingFile4] = useState({}); // Track loading state for individual files

  const fetchUserFiles = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/files/list-files", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (response.ok) {
        setFiles(result.files);
      } else {
        console.error("Error fetching files:", result.error);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFiles();
  }, []);

  // View File
  const handleView = async (fileName) => {
    setLoadingFile1((prev) => ({ ...prev, [fileName]: true }));
    const token = sessionStorage.getItem("token");
    const viewUrl = `http://localhost:5000/api/files/download/${fileName}?view=true`;

    try {
      const response = await fetch(viewUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const fileURL = URL.createObjectURL(blob);
        window.open(fileURL, "_blank");
      } else {
        console.error("View Error:", await response.json());
      }
    } catch (err) {
      console.error("View Error:", err);
    }
    finally {
      setLoadingFile1((prev) => ({ ...prev, [fileName]: false }));
    }

  };


  // Download File 
  const handleDownload = async (fileName) => {
    setLoadingFile4((prev) => ({ ...prev, [fileName]: true }));
    const token = sessionStorage.getItem("token");
    const downloadUrl = `http://localhost:5000/api/files/download/${fileName}`;

    try {
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Download Error:", await response.json());
      }
    } catch (err) {
      console.error("Download Error:", err);
    }
    finally {
      setLoadingFile4((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  // Delete Permanently
  const handleDelete = async (fileName) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}" permanently?`)) return;
    setLoadingFile2((prev) => ({ ...prev, [fileName]: true }));
  
    const token = sessionStorage.getItem("token");
    const deleteUrl = `http://localhost:5000/api/files/delete/${fileName}`;
  
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        alert('File Deleted successfully');
        console.log("File deleted successfully");
      } else {
        const result = await response.json();
        console.error("Delete Error:", result.error);
      }
    } catch (err) {
      console.error("Delete Error:", err);
    } finally {
      setLoadingFile2((prev) => ({ ...prev, [fileName]: false }));
    }
  };
  



  // Move to Trash
  const handleTrash = async (fileName) => {
    if (!window.confirm(`Are you sure you want to move "${fileName}" to trash?`)) return;
  
    setLoadingFile3((prev) => ({ ...prev, [fileName]: true }));
    const token = sessionStorage.getItem("token");
    const trashUrl = `http://localhost:5000/api/files/trash/${fileName}`;
  
    try {
      const response = await fetch(trashUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
        alert("File moved to trash successfully");
        console.log("File moved to trash successfully");
      } else {
        const result = await response.json();
        console.error("Trash Error:", result.error);
      }
    } catch (err) {
      console.error("Trash Error:", err);
    } finally {
      setLoadingFile3((prev) => ({ ...prev, [fileName]: false }));
    }
  };
  


  return (
    <div className="p-6 border rounded-lg shadow-lg mt-6 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        📁 Your Uploaded Files
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => (
            <div
              key={file.name}
              className="w-52 min-h-60 border rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-all hover:scale-105 bg-gray-50"
            >
              {/* File Name with Tooltip */}
              <div
                className="text-center font-semibold text-base break-words overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                title={file.name}
                style={{ maxHeight: "4rem" }}
              >
                {file.name}
              </div>

              {/* File Size */}
              {file.metadata && file.metadata.size && (
                <div className="text-sm text-gray-500 text-center mt-1">
                  {(file.metadata.size / 1024).toFixed(2)} KB
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                <button disabled={loadingFile1[file.name]} onClick={() => handleView(file.name)} className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-sm py-1 rounded-lg hover:from-teal-500 hover:to-cyan-600 transition flex justify-center items-center">
                   {loadingFile1[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "👁️ View"}
                </button>
                <button disabled={loadingFile2[file.name]}  onClick={() => handleDelete(file.name)} className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm py-1 rounded-lg hover:from-rose-600 hover:to-red-700 transition flex justify-center items-center">
                   {loadingFile2[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "🗑️ Delete Permanently"}
                </button>
                <button disabled={loadingFile3[file.name]}  onClick={() => handleTrash(file.name)} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm py-1 rounded-lg hover:from-amber-500 hover:to-orange-600 transition flex justify-center items-center">
                   {loadingFile3[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "🛢️ Move to Trash"}
                </button>
                <button disabled={loadingFile4[file.name]}  onClick={() => handleDownload(file.name)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm py-1 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition flex justify-center items-center">
                   {loadingFile4[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : "⬇️ Download"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFiles;
