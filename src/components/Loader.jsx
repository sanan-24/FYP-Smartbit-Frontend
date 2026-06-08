import React from 'react';

const Loader = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-20 h-20 border-8',
  };

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizes[size]} border-primary border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
};

export default Loader;
