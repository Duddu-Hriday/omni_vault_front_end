import React, { useEffect, useState } from "react";

const UserFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null); // Tracks the action in progress

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

  const handleAction = async (action, fileName) => {
    const token = sessionStorage.getItem("token");
    let url = "";
    let method = "GET";

    if (action === "view") {
      url = `http://localhost:5000/api/files/download/${fileName}?view=true`;
    } else if (action === "download") {
      url = `http://localhost:5000/api/files/download/${fileName}`;
    } else if (action === "delete") {
      url = `http://localhost:5000/api/files/delete/${fileName}`;
      method = "DELETE";
    } else if (action === "trash") {
      url = `http://localhost:5000/api/files/trash/${fileName}`;
      method = "POST";
    }

    if ((action === "delete" || action === "trash") && !window.confirm(`Are you sure you want to ${action} "${fileName}"?`)) {
      return;
    }

    setLoadingAction({ action, fileName });

    try {
      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (action === "view" || action === "download") {
          const blob = await response.blob();
          const fileURL = URL.createObjectURL(blob);
          if (action === "view") window.open(fileURL, "_blank");
          else {
            const link = document.createElement("a");
            link.href = fileURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
          alert(`File ${action === "delete" ? "deleted permanently" : "moved to trash"} successfully`);
        }
      } else {
        console.error(`${action} Error:`, await response.json());
      }
    } catch (err) {
      console.error(`${action} Error:`, err);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="p-6 border rounded-lg shadow-lg mt-6 bg-white max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📁 Your Uploaded Files</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : files.length === 0 ? (
        <p className="text-center text-gray-500">No files uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {files.map((file) => (
            <div key={file.name} className="w-52 min-h-60 border rounded-xl p-4 flex flex-col justify-between shadow-md hover:shadow-xl transition-all hover:scale-105 bg-gray-50">
              <div className="text-center font-semibold text-base break-words overflow-auto" title={file.name} style={{ maxHeight: "4rem" }}>
                {file.name}
              </div>
              {file.metadata && file.metadata.size && <div className="text-sm text-gray-500 text-center mt-1">{(file.metadata.size / 1024).toFixed(2)} KB</div>}
              <div className="flex flex-col gap-2 mt-4">
                {["view", "download", "delete", "trash"].map((action) => (
                  <button
                    key={action}
                    onClick={() => handleAction(action, file.name)}
                    className={`text-white text-sm py-1 rounded-lg transition flex items-center justify-center ${
                      action === "view" ? "bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600" :
                      action === "download" ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" :
                      action === "delete" ? "bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700" :
                      "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
                    }`}
                    disabled={loadingAction && loadingAction.fileName === file.name && loadingAction.action === action}
                  >
                    {loadingAction && loadingAction.fileName === file.name && loadingAction.action === action ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      action === "view" ? "👁️ View" :
                      action === "download" ? "⬇️ Download" :
                      action === "delete" ? "🗑️ Delete Permanently" :
                      "🛢️ Move to Trash"
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFiles;
