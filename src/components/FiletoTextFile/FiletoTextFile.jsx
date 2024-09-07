import React, { useState, useCallback } from 'react';
import BrowseButton from '../BrowseButton/BrowseButton';
import ConvertButton from '../convertButton/ConvertButton';
import DownloadButton from '../downloadButton/DownloadButton';
import './FileToFileText.css';
import { convertDocxToHTML } from '../word-to-html';
import beautify from 'js-beautify'; // Import js-beautify
const { html } = beautify;


const FileToFileText = ({ inputFileType, outputFileType }) => {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState('');
  const [fileURL, setFileURL] = useState('');

  const handleFileSelect = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.includes(inputFileType)) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setFileURL(fileUrl);
      console.log(`Valid file selected: ${selectedFile.name}`);
    } else {
      console.error(`Invalid file type. Expected ${inputFileType}.`);
    }
  }, [inputFileType]);

  const handleConvert = useCallback(async () => {
    if (file) {
      console.log('Starting conversion for file:', file);
      try {
        const result = await convertDocxToHTML(file);
        console.log('Conversion successful:', result);
        const beautifiedHTML = html(result); // Beautify the HTML
        setOutput(beautifiedHTML);
      } catch (error) {
        console.error('Error during conversion:', error);
      }
    } else {
      console.error('No file selected for conversion.');
    }
  }, [file]);

  const handleDownload = () => {
    if (output) {
      const blob = new Blob([output], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'converted.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="file-to-file-text-container">
      <div className="file-upload-area">
        <BrowseButton id="file-upload" name="file-upload" onFileSelect={handleFileSelect} />
        {file && (
          <div>
            <p>Selected file: <strong>{file.name}</strong></p>
            <a href={fileURL} target="_blank" rel="noopener noreferrer">
              Open {file.name}
            </a>
          </div>
        )}
        <ConvertButton id="convert-btn" name="convert-btn" onClick={handleConvert} />
      </div>
      <div className="output-area">
        <textarea 
          id="output-text"
          name="output-text"
          value={output}
          readOnly
          rows="10"
          placeholder={`Converted ${outputFileType ? outputFileType.toUpperCase() : ''} will appear here`}
        />
        <DownloadButton onClick={handleDownload} />
      </div>
    </div>
  );
};

export default FileToFileText;