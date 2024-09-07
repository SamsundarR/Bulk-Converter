// src/components/DownloadButton/DownloadButton.jsx
import React from 'react';

const DownloadButton = ({ content, filename, fileType }) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="btn">
      Download
    </button>
  );
};

export default DownloadButton;
