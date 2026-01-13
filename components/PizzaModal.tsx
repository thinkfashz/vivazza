
"use client";

import React, { useState, useEffect } from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { INGREDIENTS } from '../constants';
import { X, UtensilsCrossed, Flame, ShoppingBag } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pizza: Pizza) => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose, onAdd }) => {
  // Use a local state to ensure the image source is only applied after the modal is open.
  // This prevents pre-fetching during the app's initial load.
  const [deferredSrc, setDeferredSrc] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pizza) {
      // Delay to ensure the modal open animation has started/finished before
      // the network-heavy high-res image request begins.
      const timer = setTimeout(() => {
        setDeferredSrc(pizza.image);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      // Reset source when closed to clear memory and ensure next load is fresh
      setDeferredSrc(null);
    }
  }, [isOpen, pizza]);

  if (!isOpen || !pizza) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-vivazza-stone/40 backdrop-blur-xl animate-fade-in" role="dialog" aria-modal="true">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] flex flex-col md:flex-row animate-scale-in relative z-10 border border-white/20">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-30 p-3 bg-white/80 hover:bg-white backdrop-blur-md rounded-full text-vivazza-stone transition-all shadow-lg active:scale-90"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden bg-gray-50 border-b md:border-b-0 md:border-r border-gray-100">
          {deferredSrc ? (
            <ImageWithFallback 
              src={deferredSrc} 
              alt={pizza.name} 
              fill 
              priority={false}
              blur={true} // High quality blur-up effect enabled
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-10 h-10 border-4 border-vivazza-red/10 border-t-vivazza-red rounded-full animate-spin" />
                 <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Cargando Detalle...</span>
               </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col no-scrollbar bg-white">
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-vivazza-red/10 text-vivazza-red text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">
               Receta Vivazza Original
            </div>
            <h2 className="text-vivazza-stone font-heading text-6xl md:text-7xl uppercase leading-none tracking-tight">{pizza.name}</h2>
          </div>

          <div className="space-y-12 flex-grow animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-gray-500 text-xl leading-relaxed font-medium">{pizza.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 hover:border-vivazza-red/10 transition-colors">
                <div className="flex items-center gap-2 text-vivazza-red mb-3">
                  <Flame size={20} className="fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Valor Energético</span>
                </div>
                <p className="font-heading text-5xl text-vivazza-stone leading-none">{pizza.calories} <span className="text-sm font-bold text-gray-400">KCAL</span></p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 hover:border-vivazza-red/10 transition-colors">
                <div className="flex items-center gap-2 text-vivazza-red mb-4">
                  <UtensilsCrossed size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ingredientes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pizza.ingredientsList.map((ing, i) => (
                    <span key={i} className="text-[9px] font-black bg-white px-3 py-2 rounded-xl border border-gray-200 text-gray-400 uppercase tracking-tighter">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {pizza.history && (
              <div className="relative p-10 bg-vivazza-cream rounded-[3rem] border border-vivazza-gold/15 group">
                 <div className="absolute -top-4 left-8 bg-vivazza-stone text-vivazza-gold text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    Historia Vivazza
                 </div>
                 <p className="italic text-vivazza-stone/70 leading-relaxed text-base font-medium">
                   "{pizza.history}"
                 </p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-between animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Total (IVA Incluido)</span>
              <span className="font-heading text-6xl text-vivazza-red leading-none tracking-tight">{formatCLP(pizza.price)}</span>
            </div>
            <button 
              onClick={() => { onAdd(pizza); onClose(); }}
              className="bg-vivazza-red text-white px-10 py-6 rounded-[2rem] font-heading text-2xl shadow-red active:scale-95 transition-all flex items-center gap-4 hover:brightness-110"
            >
              <ShoppingBag size={28} /> AGREGAR AL PEDIDO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
