
"use client";

import React from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { X, UtensilsCrossed, Flame, History, ShoppingBag } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pizza: Pizza) => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose, onAdd }) => {
  if (!isOpen || !pizza) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-vivazza-stone/80 backdrop-blur-md animate-fade-in">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in relative z-10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-white/10 hover:bg-white/30 backdrop-blur-md rounded-full text-white md:text-vivazza-stone md:bg-gray-100 md:hover:bg-gray-200 transition-all shadow-lg"
        >
          <X size={24} />
        </button>

        <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
          <ImageWithFallback src={pizza.image} alt={pizza.name} fill />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:hidden" />
          <div className="absolute bottom-8 left-8 md:hidden">
            <span className="bg-vivazza-gold text-vivazza-stone text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-lg">
              {pizza.type === 'traditional' ? 'Tradicional' : 'Especial'}
            </span>
            <h2 className="text-white font-heading text-5xl uppercase leading-none">{pizza.name}</h2>
          </div>
        </div>

        <div className="md:w-1/2 p-8 md:p-14 overflow-y-auto flex flex-col no-scrollbar">
          <div className="hidden md:block mb-10">
            <span className="text-vivazza-red font-black uppercase tracking-[0.25em] text-xs mb-3 block">
              {pizza.type === 'traditional' ? 'Receta Tradicional Italiana' : 'Selección Firma de Autor'}
            </span>
            <h2 className="text-vivazza-stone font-heading text-6xl uppercase leading-none tracking-tight">{pizza.name}</h2>
          </div>

          <div className="space-y-8 flex-grow">
            <p className="text-gray-500 text-xl leading-relaxed font-medium">{pizza.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-vivazza-red">
                  <Flame size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información</span>
                </div>
                <p className="font-heading text-3xl text-vivazza-stone leading-none">{pizza.calories} <span className="text-sm font-body font-bold text-gray-400">KCAL</span></p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-vivazza-red">
                  <UtensilsCrossed size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Ingredientes</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {pizza.ingredientsList.map((ing, i) => (
                    <span key={i} className="text-[9px] font-bold bg-white px-2 py-1 rounded-md border border-gray-200 text-gray-500 uppercase">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {pizza.history && (
              <div className="bg-vivazza-cream/50 p-6 rounded-[2rem] border border-vivazza-gold/20 relative">
                <History className="absolute top-6 right-6 text-vivazza-gold/30" size={32} />
                <h4 className="text-xs font-black uppercase tracking-widest text-vivazza-gold mb-3 italic">Detrás de la masa</h4>
                <p className="text-sm text-vivazza-stone italic leading-relaxed font-medium">"{pizza.history}"</p>
              </div>
            )}
          </div>

          <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">Precio Final</span>
              <span className="font-heading text-5xl text-vivazza-red leading-none">{formatCLP(pizza.price)}</span>
            </div>
            <button 
              onClick={() => { onAdd(pizza); onClose(); }}
              className="w-full sm:w-auto bg-vivazza-red text-white px-12 py-5 rounded-2xl font-heading text-2xl shadow-red hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingBag size={24} />
              AGREGAR AL PEDIDO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
