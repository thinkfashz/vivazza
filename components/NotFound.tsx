
import React from 'react';
import { Pizza, ArrowLeft, Home } from 'lucide-react';

interface NotFoundProps {
  onBack: () => void;
}

const NotFound: React.FC<NotFoundProps> = ({ onBack }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
      <div className="relative mb-8">
        <div className="w-32 h-32 bg-vivazza-red/10 rounded-full flex items-center justify-center animate-pulse">
          <Pizza size={64} className="text-vivazza-red rotate-12" />
        </div>
        <div className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
          Error 404
        </div>
      </div>
      
      <h2 className="font-heading text-5xl md:text-7xl text-vivazza-stone mb-4 uppercase leading-none">
        ¡Masa <span className="text-vivazza-red">Quemada!</span>
      </h2>
      
      <p className="text-gray-500 max-w-md mb-10 font-medium">
        Parece que el pizzero se perdió en el camino. La página que buscas no existe o ha sido devorada.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center">
        <button 
          onClick={onBack}
          className="bg-vivazza-red text-white px-8 py-4 rounded-xl font-heading text-xl shadow-red flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Home size={20} />
          VOLVER AL MENÚ
        </button>
        
        <a 
          href="https://wa.me/56912345678" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-vivazza-stone text-white px-8 py-4 rounded-xl font-heading text-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          SOPORTE WHATSAPP
        </a>
      </div>

      <div className="mt-16 opacity-20 grayscale pointer-events-none select-none">
        <h3 className="font-heading text-9xl text-vivazza-stone">VIVAZZA</h3>
      </div>
    </div>
  );
};

export default NotFound;
