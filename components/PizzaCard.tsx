
"use client";

import React, { useState, useCallback, useRef } from 'react';
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

  const handleAdd = useCallback(() => {
    onAdd(pizza);
    setIsAdded(true);
    
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  }, [onAdd, pizza]);

  return (
    <div className={`bg-white rounded-[2.5rem] overflow-hidden soft-ui-shadow transition-all duration-300 group flex flex-col md:flex-row border border-black/5 will-change-transform ${isAdded ? 'border-primary/30 scale-[1.01]' : ''}`}>
      <div className="md:w-2/5 relative h-52 md:h-auto overflow-hidden">
        <ImageWithFallback 
          src={pizza.image} 
          alt={pizza.name} 
          fill
          priority={isPriority}
          className="group-hover:scale-105 transition-transform duration-700 ease-out" 
        />
        {pizza.type === 'special' && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-[0.1em] shadow-xl z-10">
            Artesanal Autor
          </div>
        )}
      </div>
      
      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
        <div className="space-y-2">
          <h4 className="font-heading text-4xl text-vivazza-stone uppercase leading-none tracking-tight">
            {pizza.name}
          </h4>
          <p className="text-gray-400 text-xs line-clamp-2 font-medium leading-relaxed">
            {pizza.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-black/5">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Inversión Gourmet</span>
            <span className="font-heading text-3xl text-primary leading-none">
              {formatCLP(pizza.price)}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onViewDetails(pizza)}
              className="p-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-colors border border-black/5"
            >
              <Info size={18} />
            </button>
            <button 
              onClick={handleAdd}
              className={`${isAdded ? 'bg-green-500' : 'bg-primary'} text-white p-3.5 rounded-xl shadow-soft hover:brightness-110 active:scale-90 transition-all duration-200 relative overflow-hidden`}
            >
              <div className={`transition-transform duration-200 ${isAdded ? 'scale-0' : 'scale-100'}`}>
                <Plus size={20} />
              </div>
              {isAdded && (
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-200">
                  <Check size={20} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PizzaCard);
