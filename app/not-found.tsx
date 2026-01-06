
"use client";

import React from 'react';
import Link from 'next/link';
import { Pizza, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-grain flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-8 animate-fade-in-up">
        <div className="w-40 h-40 bg-vivazza-red/10 rounded-full flex items-center justify-center animate-pulse">
          <Pizza size={80} className="text-vivazza-red rotate-12" />
        </div>
        <div className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-tighter shadow-lg">
          Error 404
        </div>
      </div>
      
      <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone mb-4 uppercase leading-none">
        ¡Masa <span className="text-vivazza-red">Quemada!</span>
      </h2>
      
      <p className="text-gray-500 max-w-md mb-12 font-medium text-lg">
        Parece que el pizzero se perdió en el camino. La página que buscas no existe o ha sido devorada por un cliente hambriento.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <Link 
          href="/"
          className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-red-700"
        >
          <Home size={24} />
          VOLVER AL MENÚ
        </Link>
        
        <a 
          href="https://wa.me/56912345678" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-vivazza-stone text-white px-10 py-5 rounded-2xl font-heading text-2xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-stone-800"
        >
          SOPORTE WHATSAPP
        </a>
      </div>

      <div className="mt-20 opacity-10 grayscale pointer-events-none select-none">
        <h3 className="font-heading text-[12rem] text-vivazza-stone leading-none">VIVAZZA</h3>
      </div>
    </div>
  );
}
