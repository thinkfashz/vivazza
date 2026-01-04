import React from 'react';
import { Pizza } from '../types';
import { X, Flame } from 'lucide-react';
import { formatCLP } from '../utils';

interface PizzaModalProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (pizza: Pizza) => void;
}

const PizzaModal: React.FC<PizzaModalProps> = ({ pizza, isOpen, onClose, onAdd }) => {
  if (!isOpen || !pizza) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-vivazza-stone/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      <div className="relative bg-vivazza-cream w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <X size={24} className="text-vivazza-stone" />
        </button>

        <div className="grid md:grid-cols-2">
          <div className="h-64 md:h-full relative">
            <img 
              src={pizza.image} 
              alt={pizza.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="p-8 flex flex-col justify-center bg-grain">
            <span className="text-vivazza-red font-heading text-xl mb-2">{formatCLP(pizza.price)}</span>
            <h2 className="text-4xl font-heading text-vivazza-stone mb-4">{pizza.name}</h2>
            
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Flame size={16} className="text-orange-500" />
              <span>{pizza.calories} kcal aprox.</span>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-vivazza-stone">La Historia</h4>
              <p className="text-gray-600 font-light italic leading-relaxed">
                "{pizza.history || pizza.description}"
              </p>
            </div>

            <div className="mb-8">
              <h4 className="font-bold text-sm uppercase tracking-wider mb-2 text-vivazza-stone">Ingredientes</h4>
              <div className="flex flex-wrap gap-2">
                {pizza.ingredientsList.map((ing, i) => (
                  <span key={i} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-gray-600">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            <button 
              onClick={() => {
                onAdd(pizza);
                onClose();
              }}
              className="w-full bg-vivazza-stone text-white py-4 rounded-xl font-heading text-xl hover:bg-black transition-colors shadow-lg"
            >
              Añadir al Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PizzaModal;