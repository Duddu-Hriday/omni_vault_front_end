import React, { useEffect, useState } from "react";

const TrashFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState({}); // Track loading state for individual files
  const [loadingFiles1, setLoadingFiles1] = useState({}); // Track loading state for individual files


  const fetchTrashFiles = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/files/trash-files", {
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
    fetchTrashFiles();
  }, []);

  // Handle file deletion
  const handleDelete = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}" permanently?`)) {
      setLoadingFiles((prev) => ({ ...prev, [fileName]: true })); // Set loading for this file
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/files/deletefromtrash/${fileName}`, {
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
        setLoadingFiles((prev) => ({ ...prev, [fileName]: false })); // Remove loading state
      }
    }
  };

  // Handle restoring file from trash
  const handleRestore = async (fileName) => {
    if (window.confirm(`Are you sure you want to restore "${fileName}"?`)) {
      setLoadingFiles1((prev) => ({ ...prev, [fileName]: true })); // Set loading for this file
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/files/recoverfromtrash/${fileName}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
          alert('File restored from trash successfully');
          console.log("File restored successfully");
        } else {
          const result = await response.json();
          console.error("Restore Error:", result.error);
        }
      } catch (err) {
        console.error("Restore Error:", err);
      } finally {
        setLoadingFiles1((prev) => ({ ...prev, [fileName]: false })); // Remove loading state
      }
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg mt-6 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Recycle Bin
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">No files in trash.</p>
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
                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={loadingFiles[file.name]}
                  className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm py-1 rounded-lg hover:from-rose-600 hover:to-red-700 transition flex justify-center items-center"
                >
                  {loadingFiles[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "🗑️ Delete Permanently"
                  )}
                </button>

                <button
                  onClick={() => handleRestore(file.name)}
                  disabled={loadingFiles1[file.name]}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm py-1 rounded-lg hover:from-amber-500 hover:to-orange-600 transition flex justify-center items-center"
                >
                  {loadingFiles1[file.name] ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "🛢️ Restore from Trash"
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrashFiles;
