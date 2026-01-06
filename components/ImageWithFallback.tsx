
"use client";

import React, { useState, useEffect } from 'react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = FALLBACK_IMAGE, 
  alt, 
  className = "",
  fill = false,
  width,
  height,
  priority = false
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    setImgSrc(fallbackSrc);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const containerStyle = fill 
    ? "relative w-full h-full" 
    : "relative";

  const imgStyle = fill
    ? "absolute inset-0 w-full h-full object-cover"
    : "w-full h-auto object-cover";

  return (
    <div className={`${containerStyle} ${className} overflow-hidden bg-gray-100`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
      )}
      
      <img
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        className={`${imgStyle} transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={!fill ? { width: width || '100%', height: height || 'auto' } : {}}
      />
    </div>
  );
};

export default ImageWithFallback;
