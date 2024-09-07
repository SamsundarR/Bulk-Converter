import React from 'react';

const StyledHeader = ({ children }) => (
  <h1 style={{ color: '#2772ed', fontSize: '2rem', marginBottom: '10px' }}>
    {children}
  </h1>
);

export default StyledHeader;