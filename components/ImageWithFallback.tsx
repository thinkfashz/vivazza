
"use client";

import React, { useState, useEffect, useRef } from 'react';

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  blur?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = FALLBACK_IMAGE, 
  alt, 
  className = "",
  fill = false,
  width,
  height,
  priority = false,
  blur = true
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  // Sincronizar imgSrc cuando cambia la prop src
  useEffect(() => {
    if (src !== imgSrc) {
      setImgSrc(src);
      setIsLoading(true);
    }
  }, [src, imgSrc]);

  // Verificar si la imagen ya está cargada (útil para caché)
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoading(false);
    }
  }, [imgSrc]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
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
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-vivazza-red/10 border-t-vivazza-red rounded-full animate-spin" />
        </div>
      )}
      
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-ignore - fetchPriority is supported in modern browsers/React 19
        fetchPriority={priority ? "high" : "auto"}
        className={`${imgStyle} transition-all duration-700 ease-out ${isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'} ${blur && isLoading ? 'blur-2xl' : 'blur-0'}`}
        style={!fill ? { width: width || '100%', height: height || 'auto' } : {}}
      />
    </div>
  );
};

export default React.memo(ImageWithFallback);
