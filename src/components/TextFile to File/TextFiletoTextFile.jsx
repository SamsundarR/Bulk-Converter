import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FiUploadCloud } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import BrowseButton from '../BrowseButton/BrowseButton';
import DownloadButton from '../DownloadButton';
import { wordToHtmlLogic } from '../word-to-html'; // Ensure this function exists and is correctly implemented
import beautify from 'js-beautify'; // Import js-beautify
const { html } = beautify;
import './TextFileToTextFile.css';

const TextFileToTextFile = ({ inputFileType , fileType }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [fileURL, setFileURL] = useState('');
  const [outputText, setOutputText] = useState('');


  useEffect(() => {
    if (files.length > 0) {
      files.forEach(file => uploadFile(file));
    }
  }, [files]);

  const handleCopy = () => {
    if (outputText.trim()) {
      navigator.clipboard.writeText(outputText)
        .then(() => alert('Text copied to clipboard'))
        .catch(err => alert('Failed to copy text'));
    } else {
      alert('No text to copy!');
    }
  };

 

  const handleConvert = useCallback(async () => {
    if (file) {
      console.log('Starting conversion for file:', file);
      try {
        const result = await wordToHtmlLogic(file);
        console.log('Conversion successful:', result);
        const beautifiedHTML = html(result); // Beautify the HTML
        setOutputText(beautifiedHTML);
      } catch (error) {
        console.error('Error during conversion:', error);
      }
    } else {
      console.error('No file selected for conversion.');
    }
  }, [file]);

  const uploadFile = (file) => {
    setUploading(true);
    setUploadProgress(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(uploadInterval);
          setUploading(false);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 200);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target.result;
        setText(arrayBuffer); // Use arrayBuffer instead of text
      } catch (error) {
        console.error('File reading error:', error);
        setError('Failed to read file');
      }
    };
    reader.readAsArrayBuffer(file); // Read as ArrayBuffer
  };

  const handleFileSelect = useCallback((e) => { 
    const selectedFile = e.target.files[0];
    if (selectedFile.length > 0) {
      validateAndUploadFiles(selectedFile);
    }
    if (selectedFile && selectedFile.type.includes(inputFileType)) {
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setFileURL(fileUrl);
      console.log(`Valid file selected:, ${selectedFile.name}`);
    } else {
      console.error(`Invalid file type. Expected, ${inputFileType}.`);
    }
    
  }, [inputFileType]);


  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      validateAndUploadFiles(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateAndUploadFiles = (fileList) => {
    const validFileTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // Accept .docx files only
    ];
    const invalidFiles = fileList.filter(file => !validFileTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      setError('Upload a valid .docx file!');
      return;
    }
    setError('');
    setFiles(fileList);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleInputChange = (e) => {
    setText(e.currentTarget.innerText); // Update text state with content from contentEditable div
  };

  return (
    <div className="container">
      <div className="file-upload" onDrop={handleDrop} onDragOver={handleDragOver}>
        {uploading && (
          <div className="uploading-popup">
            <FaSpinner size={30} className="spinning-icon" />
            <p>Uploading... {uploadProgress}%</p>
          </div>
        )}
        {!uploading && (
          <>
            <FiUploadCloud size={40} className="upload-icon" />
            <p className="upload-text">
              Drop files to upload or <span className="highlight"> <BrowseButton onFileSelect={handleFileSelect} /></span>
            </p>
          </>
        )}
        {error && <p className="error-message">{error}</p>}
        <div className="uploaded-files">
          {files.length > 0 && !uploading && (
            files.map((file, index) => (
              <div key={index} className="uploaded-file">
                <p>{file.name}</p>
                <AiOutlineClose size={20} className="remove-icon" onClick={() => removeFile(index)} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="text-area-container">
        <div
          className="input-text-area"
          contentEditable
          onInput={handleInputChange}
          suppressContentEditableWarning={true}
        >
          {text === '' && <div className="placeholder">Paste your document here...</div>}
        </div>
        <div className="output-text-area">
          {outputText === '' && <div className="placeholder">..get your output here</div>}
          <div dangerouslySetInnerHTML={{ __html: outputText }} />
        </div>
      </div>
      <div className="toolbar">
        <button className="btn" onClick={handleCopy}>Copy Output</button>
        <DownloadButton content={outputText} filename={`output.${fileType}`} fileType={fileType} />
        <button className="btn" onClick={handleConvert}>Convert</button>
      </div>
    </div>
  );
};

TextFileToTextFile.propTypes = {
  fileType: PropTypes.string,
};

export default TextFileToTextFile;