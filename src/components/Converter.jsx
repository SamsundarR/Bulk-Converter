import React, { useState, useEffect } from 'react';

const Converter = ({ convertLogic, children }) => {
  const [text, setText] = useState('');
  const [outputText, setOutputText] = useState('');

  useEffect(() => {
    const convertText = async () => {
      if (text) {
        try {
          const result = await convertLogic(text);
          setOutputText(result);
        } catch (error) {
          console.error('Error during conversion:', error);
          setOutputText('Conversion failed');
        }
      }
    };

    convertText();
  }, [text, convertLogic]);

  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="converter-container">
      {/* Input Area */}
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Paste your content here..."
      />

      {/* Output Area */}
      <div
        className="output-area"
        dangerouslySetInnerHTML={{ __html: outputText }}
      />

      {/* Render children (e.g., buttons) */}
      {children}
    </div>
  );
};

export default Converter;
