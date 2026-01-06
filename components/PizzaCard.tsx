import React, { useState } from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { Plus, Info, Check, Star } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface PizzaCardProps {
  pizza: Pizza;
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAdd, onViewDetails }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(pizza);
    setIsAdded(true);
    if (navigator.vibrate) navigator.vibrate(50); // Haptic feedback
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform hover:-translate-y-2 touch-manipulation border border-gray-100/50">
      <div className="relative h-64 overflow-hidden cursor-pointer active:opacity-95 transition-opacity" onClick={() => onViewDetails(pizza)}>
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10" />
        <ImageWithFallback 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-full object-cover transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-4 left-4 z-20 flex gap-2">
            <div className="bg-white/95 backdrop-blur-sm text-vivazza-stone text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1.5 border border-white/20">
                <Star size={10} className="fill-vivazza-gold text-vivazza-gold" />
                <span className="tracking-tighter">4.9</span>
            </div>
        </div>
        {pizza.type === 'special' && (
          <span className="absolute top-4 right-4 z-20 bg-vivazza-gold text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-lg border border-vivazza-gold/50">
            Autor
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-2xl text-vivazza-stone leading-none tracking-tight">{pizza.name}</h3>
          <span className="font-heading text-xl text-vivazza-red">{formatCLP(pizza.price)}</span>
        </div>
        
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
          {pizza.description}
        </p>
        
        <div className="flex items-center gap-3 mt-4 relative">
          {/* Temporary confirmation message */}
          {isAdded && (
            <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none z-10">
               <div className="bg-vivazza-stone text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-fade-in-up flex items-center gap-1">
                 <Check size={12} className="text-green-400" />
                 ¡Añadido!
               </div>
            </div>
          )}

          <button 
            onClick={handleAdd}
            disabled={isAdded}
            className={`flex-1 py-3 px-4 rounded-xl font-heading text-lg tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group/btn active:scale-95 ${
              isAdded 
                ? 'bg-green-600 text-white scale-[0.98] shadow-inner' 
                : 'bg-vivazza-red text-white hover:bg-red-700 active:shadow-inner shadow-red hover:shadow-xl'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={18} className="animate-bounce" />
                <span>Listo</span>
              </>
            ) : (
              <>
                <Plus size={18} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                <span>LO QUIERO</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => onViewDetails(pizza)}
            className="p-3 rounded-xl border border-gray-100 text-gray-400 hover:border-vivazza-stone hover:text-vivazza-stone transition-all active:bg-gray-50 group/info"
            aria-label="Ver historia"
          >
            <Info size={20} className="group-hover/info:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;