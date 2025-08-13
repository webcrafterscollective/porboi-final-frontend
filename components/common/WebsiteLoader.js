// components/common/WebsiteLoader.js
import React from 'react';

const WebsiteLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="loader-container">
      <div className="loader-logo">
        <img src="/file.svg" alt="Loading logo" className="h-72 w-auto" />
      </div>
    </div>
  );
};

export default WebsiteLoader;
