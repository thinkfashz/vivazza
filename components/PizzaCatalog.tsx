
"use client";

import React from 'react';
import { PIZZAS } from '../constants';
import { formatCLP } from '../utils';
import ImageWithFallback from './ImageWithFallback';
import { Pizza } from '../types';
import { ShoppingBag, Info, Star } from 'lucide-react';

interface PizzaCatalogProps {
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
}

const PizzaCatalog: React.FC<PizzaCatalogProps> = ({ onAdd, onViewDetails }) => {
  return (
    <div className="animate-fade-in-up space-y-16 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-heading text-6xl md:text-8xl text-vivazza-stone uppercase leading-none mb-4">
          CATÁLOGO <span className="text-vivazza-red">COMPLETO</span>
        </h2>
        <p className="text-gray-500 font-medium text-lg">
          Explora toda nuestra variedad de pizzas artesanales, preparadas con reposo artesanal de 48h y los mejores ingredientes seleccionados.
        </p>
        <p className="text-[10px] font-black uppercase text-vivazza-red tracking-[0.3em] mt-4">Todos los precios incluyen IVA</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {PIZZAS.map((pizza) => (
          <div 
            key={pizza.id} 
            className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row group hover:shadow-2xl transition-all duration-500"
          >
            <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
              <ImageWithFallback 
                src={pizza.image} 
                alt={pizza.name} 
                fill 
                className="group-hover:scale-105 transition-transform duration-1000"
              />
              {pizza.type === 'special' && (
                <div className="absolute top-6 left-6 bg-vivazza-gold text-vivazza-stone text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2">
                  <Star size={14} fill="currentColor" /> Especial del Maestro
                </div>
              )}
            </div>
            
            <div className="md:w-2/3 p-8 md:p-12 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-heading text-5xl text-vivazza-stone uppercase leading-none tracking-tight">
                    {pizza.name}
                  </h3>
                  <div className="text-right">
                    <span className="font-heading text-4xl text-vivazza-red block leading-none">
                      {formatCLP(pizza.price)}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">IVA incluido</span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-lg mb-8 leading-relaxed font-medium">
                  {pizza.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {pizza.ingredientsList.map((ing, i) => (
                    <span key={i} className="text-[10px] font-black bg-vivazza-cream px-4 py-2 rounded-full border border-vivazza-gold/10 text-vivazza-stone uppercase tracking-widest">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-8 border-t border-gray-50">
                <button 
                  onClick={() => onAdd(pizza)}
                  className="bg-vivazza-red text-white px-8 py-4 rounded-2xl font-heading text-xl shadow-red active:scale-95 transition-all flex items-center gap-3"
                >
                  <ShoppingBag size={20} /> AGREGAR AL PEDIDO
                </button>
                <button 
                  onClick={() => onViewDetails(pizza)}
                  className="bg-gray-50 text-vivazza-stone px-8 py-4 rounded-2xl font-heading text-xl border border-gray-100 hover:bg-gray-100 transition-all flex items-center gap-3"
                >
                  <Info size={20} /> DETALLES COMPLETOS
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-vivazza-stone text-white rounded-[3rem] p-12 text-center shadow-premium">
        <h4 className="font-heading text-4xl mb-4 uppercase tracking-tight">¿No encuentras tu combinación ideal?</h4>
        <p className="text-gray-400 mb-8 max-w-xl mx-auto font-medium">Usa nuestro Pizza Lab para crear una pizza única con tus ingredientes favoritos.</p>
        <button 
          className="bg-vivazza-red text-white px-10 py-5 rounded-2xl font-heading text-2xl shadow-red active:scale-95 transition-all"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          IR AL PIZZA LAB
        </button>
      </div>
    </div>
  );
};

export default PizzaCatalog;
