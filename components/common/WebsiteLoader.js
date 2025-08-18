// components/common/WebsiteLoader.js
import React from 'react';

const WebsiteLoader = ({ isLoading }) => {
  // We use CSS classes for smooth fade-in/fade-out transitions
  const loaderClass = isLoading 
    ? 'opacity-100 visible' 
    : 'opacity-0 invisible';

  return (
    <div className={`loader-container ${loaderClass}`}>
      <div className="loader-book">
        {/* These two divs represent the covers of the book opening */}
        <div className="book-cover book-cover-left"></div>
        <div className="book-cover book-cover-right"></div>
        
        {/* The logo is revealed in the center */}
        <div className="loader-logo-container">
          <img src="/file.svg" alt="Porboi Loading" className="loader-logo" />
        </div>
      </div>
      <p className="loader-text">PORBOI.IN</p>
    </div>
  );
};

export default WebsiteLoader;
