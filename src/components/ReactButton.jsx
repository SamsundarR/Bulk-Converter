import React from 'react';

const ReactButton = ({ onClick, children }) => (
  <button onClick={onClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
    {children}
  </button>
);

export default ReactButton;
