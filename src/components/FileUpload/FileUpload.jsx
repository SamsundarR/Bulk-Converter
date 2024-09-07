import React, { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import BrowseButton from '../BrowseButton/BrowseButton';
import './FileUpload.css';

const FileUpload = ({ onFilesUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const uploadFile = (file) => {
    setUploading(true);
    setUploadProgress(0);
    const uploadInterval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          onFilesUploaded(files); // Notify parent component of uploaded files
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
      selectedFiles.forEach(file => uploadFile(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
      droppedFiles.forEach(file => uploadFile(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) => prevFiles.filter(file => file !== fileToRemove));
  };

  return (
    <div>
      <div
        className={`file-upload ${uploading ? 'uploading' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {uploading && (
          <div className="uploading-popup">
            <FaSpinner size={30} className="spinning-icon" />
            <p>Uploading... {uploadProgress}%</p>
          </div>
        )}
        {!uploading && (
          <>
            <FiUploadCloud size={60} className="upload-icon" />
            <p className="upload-text">
              Drop files to upload or{' '}
              <BrowseButton onFileSelect={handleFileSelect} />
            </p>
          </>
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="uploaded-files">
        {files.length > 0 && !uploading && (
          files.map((file, index) => (
            <div key={index} className="uploaded-file">
              <p>{file.name}</p>
              <AiOutlineClose size={20} className="remove-icon" onClick={() => handleRemoveFile(file)} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FileUpload;
