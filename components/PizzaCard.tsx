
"use client";

import React, { useState } from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { Info, Plus, Check } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface PizzaCardProps {
  pizza: Pizza;
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
  index?: number;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAdd, onViewDetails, index = 0 }) => {
  const [isAdded, setIsAdded] = useState(false);
  const isPriority = index < 3;

  const handleAdd = () => {
    onAdd(pizza);
    setIsAdded(true);
    
    // Feedback hápitco si está disponible
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    // Resetear el estado después de la animación
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  return (
    <div className={`bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group flex flex-col md:flex-row border ${isAdded ? 'border-vivazza-red scale-[1.02] shadow-red' : 'border-gray-100/50'}`}>
      <div className="md:w-2/5 relative h-56 md:h-auto overflow-hidden">
        <ImageWithFallback 
          src={pizza.image} 
          alt={pizza.name} 
          fill
          priority={isPriority}
          className="group-hover:scale-110 transition-transform duration-1000 ease-out" 
        />
        {pizza.type === 'special' && (
          <div className="absolute top-4 left-4 bg-vivazza-gold text-vivazza-stone text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.15em] shadow-xl z-10 backdrop-blur-sm">
            Especial Autor
          </div>
        )}
      </div>
      
      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-heading text-3xl text-vivazza-stone uppercase leading-none tracking-tight">
              {pizza.name}
            </h4>
          </div>
          <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-medium leading-relaxed">
            {pizza.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Precio</span>
            <span className="font-heading text-3xl text-vivazza-red leading-none">
              {formatCLP(pizza.price)}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => onViewDetails(pizza)}
              className="p-3 text-vivazza-stone hover:bg-vivazza-cream rounded-2xl transition-all duration-300 border border-transparent hover:border-vivazza-gold/30 shadow-sm"
              aria-label="Ver detalles"
            >
              <Info size={22} />
            </button>
            <button 
              onClick={handleAdd}
              className={`${isAdded ? 'bg-green-600' : 'bg-vivazza-red'} text-white p-4 rounded-2xl shadow-red hover:opacity-90 active:scale-90 transition-all duration-300 group/btn relative overflow-hidden`}
              aria-label="Agregar al carrito"
            >
              <div className={`transition-transform duration-300 ${isAdded ? 'scale-0' : 'scale-100'}`}>
                <Plus size={24} className="group-hover/btn:rotate-90 transition-transform duration-300" />
              </div>
              
              {isAdded && (
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-300">
                  <Check size={24} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
