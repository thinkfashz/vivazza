
"use client";

import React from 'react';
import { Pizza, Home, MessageCircle } from 'lucide-react';
import { VIVAZZA_CATALOG_URL } from '../constants';

interface NotFoundProps {
  onBack: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
  const playUISound = () => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const handleAction = (url?: string) => {
    playUISound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    if (url) window.open(url, '_blank');
    else onBack();
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
      <div className="relative mb-10">
        <div className="w-40 h-40 bg-vivazza-red/10 rounded-full flex items-center justify-center animate-pulse">
          <Pizza size={80} className="text-vivazza-red rotate-12" />
        </div>
        <div className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-tighter shadow-xl">
          Error 404
        </div>
      </div>
      
      <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone mb-4 uppercase leading-none tracking-tighter">
        ¡Masa <span className="text-vivazza-red">Quemada!</span>
      </h2>
      
      <p className="text-gray-500 max-w-md mb-12 font-medium text-lg leading-relaxed">
        Parece que el pizzero se perdió en los valles del Maule. La página que buscas no existe o ha sido devorada.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <button 
          onClick={() => handleAction()}
          className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-700"
        >
          <Home size={24} />
          VOLVER AL MENÚ
        </button>
        
        <button 
          onClick={() => handleAction(VIVAZZA_CATALOG_URL)}
          className="bg-vivazza-stone text-white px-10 py-5 rounded-2xl font-heading text-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-stone-800"
        >
          <MessageCircle size={24} />
          CATÁLOGO VIVAZZA
        </button>
      </div>

      <div className="mt-20 opacity-5 grayscale pointer-events-none select-none">
        <h3 className="font-heading text-[12rem] text-vivazza-stone leading-none">VIVAZZA</h3>
      </div>
    </div>
  );
};

export default NotFound;
