import React, { useEffect, useState } from 'react';

const FileList = ({ userEmail }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/files/list?email=${userEmail}`);
        const data = await res.json();

        if (res.ok) {
          setFiles(data.files);
        } else {
          console.error("Error fetching files:", data.error);
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) fetchFiles();
  }, [userEmail]);

  if (loading) return <p>Loading files...</p>;

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Your Files</h2>
      {files.length > 0 ? (
        <ul className="space-y-2">
          {files.map((file) => (
            <li key={file.name} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm">
              <span>{file.name}</span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
    </div>
  );
};

export default FileList;
