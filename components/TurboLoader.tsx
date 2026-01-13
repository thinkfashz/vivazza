
"use client";

import React from 'react';

const TurboLoader: React.FC = () => {
  return (
    <div className="w-full space-y-8 animate-pulse p-6">
      <div className="h-64 bg-gray-200 rounded-[3rem] w-full shadow-inner"></div>
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded-2xl w-3/4"></div>
        <div className="h-6 bg-gray-100 rounded-xl w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-gray-100 rounded-[2rem]"></div>
        <div className="h-48 bg-gray-100 rounded-[2rem]"></div>
        <div className="h-48 bg-gray-100 rounded-[2rem]"></div>
      </div>
    </div>
  );
};

export default TurboLoader;
