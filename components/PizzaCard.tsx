import React from 'react';
import { Pizza } from '../types';
import { formatCLP } from '../utils';
import { Plus, Info } from 'lucide-react';

interface PizzaCardProps {
  pizza: Pizza;
  onAdd: (pizza: Pizza) => void;
  onViewDetails: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAdd, onViewDetails }) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => onViewDetails(pizza)}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10" />
        <img 
          src={pizza.image} 
          alt={pizza.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {pizza.type === 'special' && (
          <span className="absolute top-4 right-4 z-20 bg-vivazza-gold text-white text-xs font-bold px-3 py-1 uppercase tracking-widest rounded-full shadow-md">
            Autor
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading text-2xl text-vivazza-stone leading-none">{pizza.name}</h3>
          <span className="font-heading text-xl text-vivazza-red">{formatCLP(pizza.price)}</span>
        </div>
        
        <p className="text-gray-500 text-sm font-light leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
          {pizza.description}
        </p>
        
        <div className="flex items-center gap-3 mt-4">
          <button 
            onClick={() => onAdd(pizza)}
            className="flex-1 bg-vivazza-red text-white py-3 px-4 rounded-lg font-heading text-lg tracking-wide hover:bg-red-700 active:shadow-inner transition-colors flex items-center justify-center gap-2 group/btn"
          >
            <Plus size={18} className="group-hover/btn:rotate-90 transition-transform" />
            Añadir
          </button>
          
          <button 
            onClick={() => onViewDetails(pizza)}
            className="p-3 rounded-lg border border-gray-200 text-gray-500 hover:border-vivazza-stone hover:text-vivazza-stone transition-colors"
            aria-label="Ver historia"
          >
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;