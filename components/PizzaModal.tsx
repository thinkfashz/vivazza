
"use client";

import React from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { INGREDIENTS } from '../constants';
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

  const getIngredientInfo = (ingName: string) => {
    const normalizedSearch = ingName.toLowerCase();
    return INGREDIENTS.find(i => 
      i.name.toLowerCase().includes(normalizedSearch) || 
      normalizedSearch.includes(i.name.toLowerCase())
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="bg-white w-full max-w-5xl max-h-[92vh] rounded-[3.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row animate-scale-in relative z-10 border border-gray-100">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-vivazza-stone transition-all"
        >
          <X size={24} />
        </button>

        <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden">
          <ImageWithFallback src={pizza.image} alt={pizza.name} fill />
        </div>

        <div className="md:w-1/2 p-8 md:p-16 overflow-y-auto flex flex-col no-scrollbar">
          <div className="mb-8">
            <span className="text-vivazza-red font-black uppercase tracking-[0.25em] text-[10px] mb-2 block">
              Receta Artesanal
            </span>
            <h2 className="text-vivazza-stone font-heading text-6xl uppercase leading-none tracking-tight">{pizza.name}</h2>
          </div>

          <div className="space-y-10 flex-grow">
            <p className="text-gray-500 text-lg leading-relaxed font-medium">{pizza.description}</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center gap-2 text-vivazza-red mb-2">
                  <Flame size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Información</span>
                </div>
                <p className="font-heading text-4xl text-vivazza-stone leading-none">{pizza.calories} <span className="text-xs font-bold text-gray-400">KCAL</span></p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                <div className="flex items-center gap-2 text-vivazza-red mb-3">
                  <UtensilsCrossed size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Toppings</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pizza.ingredientsList.map((ing, i) => (
                    <span key={i} className="text-[9px] font-bold bg-white px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 uppercase">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {pizza.history && (
              <div className="bg-vivazza-cream p-8 rounded-[2.5rem] border border-vivazza-gold/20 italic text-gray-600 leading-relaxed text-sm">
                 "{pizza.history}"
              </div>
            )}
          </div>

          <div className="mt-12 pt-10 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Precio (IVA incluido)</p>
              <p className="font-heading text-5xl text-vivazza-red leading-none">{formatCLP(pizza.price)}</p>
            </div>
            <button 
              onClick={() => { onAdd(pizza); onClose(); }}
              className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red active:scale-95 transition-all flex items-center gap-3"
            >
              <ShoppingBag size={24} /> AGREGAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;
