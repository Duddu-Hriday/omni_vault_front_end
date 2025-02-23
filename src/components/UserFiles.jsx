import React, { useEffect, useState } from "react";

const UserFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFiles = async () => {
    try {
      const token = localStorage.getItem("token");

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
                <button className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white text-sm py-1 rounded-lg hover:from-teal-500 hover:to-cyan-600 transition">
                  👁️ View
                </button>
                <button className="bg-gradient-to-r from-rose-500 to-red-600 text-white text-sm py-1 rounded-lg hover:from-rose-600 hover:to-red-700 transition">
                  🗑️ Delete Permanently
                </button>
                <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm py-1 rounded-lg hover:from-amber-500 hover:to-orange-600 transition">
                  🛢️ Move to Trash
                </button>
                <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm py-1 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition">
                  ⬇️ Download
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
