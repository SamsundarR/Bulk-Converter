import React from 'react';
import './BrowseButton.css'; // Import the CSS file

const BrowseButton = ({ onFileSelect }) => {
  return (
    <label className="browse">
      <input 
        type="file" 
        onChange={onFileSelect} 
        style={{ display: 'none' }} 
      />
      Browse
    </label>
  );
};

export default BrowseButton;
