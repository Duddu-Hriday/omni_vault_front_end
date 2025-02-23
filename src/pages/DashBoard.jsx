import React from "react";
import FileFolderUploader from "../components/FileFolderUploader";
import UserFiles from "../components/UserFiles";

const DashBoard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Google Drive Clone Dashboard</h1>
      <FileFolderUploader />
      <UserFiles />
    </div>
  );
};

export default DashBoard;
