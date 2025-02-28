import React, { useState } from "react";
import FileFolderUploader from "../components/FileFolderUploader";
import UserFiles from "../components/UserFiles";
import TrashFiles from "../components/TrashFiles";

const DashBoard = () => {
  const [showTrash, setShowTrash] = useState(false);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Omni Vault Dashboard</h1>
      <FileFolderUploader />
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded mr-2"
          onClick={() => setShowTrash(true)}
        >
          Trash
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowTrash(false)}
        >
          User Files
        </button>
      </div>
      {showTrash ? <TrashFiles /> : <UserFiles />}
    </div>
  );
};

export default DashBoard;
