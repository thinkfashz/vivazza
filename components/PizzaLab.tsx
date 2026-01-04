import React, { useState, useEffect } from 'react';
import { DOUGHS, INGREDIENTS, BASE_CUSTOM_PRICE } from '../constants';
import { Dough, Ingredient, CartItem } from '../types';
import { formatCLP } from '../utils';
import { Check, ChefHat, ShoppingBag, Sparkles } from 'lucide-react';

interface PizzaLabProps {
  onAddToCart: (item: CartItem) => void;
}

const PizzaLab: React.FC<PizzaLabProps> = ({ onAddToCart }) => {
  const [selectedDough, setSelectedDough] = useState<Dough>(DOUGHS[0]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isPriceAnimating, setIsPriceAnimating] = useState(false);

  useEffect(() => {
    const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
    const newTotal = BASE_CUSTOM_PRICE + selectedDough.price + ingredientsPrice;
    
    if (newTotal !== totalPrice) {
      setTotalPrice(newTotal);
      setIsPriceAnimating(true);
      const timer = setTimeout(() => setIsPriceAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedDough, selectedIngredients, totalPrice]);

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.find(i => i.id === ingredient.id)) {
      setSelectedIngredients(prev => prev.filter(i => i.id !== ingredient.id));
    } else {
      if (selectedIngredients.length >= 7) {
        alert("¡Wow! Esa pizza va a explotar. Máximo 7 ingredientes para asegurar una cocción perfecta.");
        return;
      }
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleAdd = () => {
    const item: CartItem = {
      id: Date.now().toString(),
      pizzaName: 'Pizza de Autor (Custom)',
      basePrice: totalPrice,
      quantity: 1,
      isCustom: true,
      dough: selectedDough,
      customIngredients: selectedIngredients,
    };
    onAddToCart(item);
    setSelectedIngredients([]);
    alert("¡Tu creación ha sido añadida al carrito!");
  };

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-vivazza-red/10 rounded-full mb-4 animate-bounce-slow">
          <ChefHat size={32} className="text-vivazza-red" />
        </div>
        <h2 className="text-5xl font-heading text-vivazza-stone mb-2">Pizza Lab</h2>
        <p className="text-gray-500 font-light">Diseña tu propia experiencia. Precio base: {formatCLP(BASE_CUSTOM_PRICE)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Config */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Dough Selection */}
          <section>
            <h3 className="font-heading text-2xl text-vivazza-stone mb-4 flex items-center gap-2">
              <span className="bg-vivazza-stone text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-sans">1</span>
              Elige tu Masa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOUGHS.map((dough) => (
                <button
                  key={dough.id}
                  onClick={() => setSelectedDough(dough)}
                  className={`relative p-4 rounded-xl text-left border-2 transition-all duration-200 transform active:scale-95 ${
                    selectedDough.id === dough.id 
                      ? 'border-vivazza-red bg-white shadow-red scale-[1.02]' 
                      : 'border-transparent bg-white hover:border-gray-200 hover:translate-y-[-2px] hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-vivazza-stone">{dough.name}</span>
                    {dough.price > 0 && <span className="text-xs font-bold text-vivazza-red">+{formatCLP(dough.price)}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{dough.description}</p>
                  <div className={`absolute top-2 right-2 text-vivazza-red transition-all duration-300 transform ${selectedDough.id === dough.id ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}>
                    <Check size={18} />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Ingredients Selection */}
          <section>
             <h3 className="font-heading text-2xl text-vivazza-stone mb-4 flex items-center gap-2">
              <span className="bg-vivazza-stone text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-sans">2</span>
              Toppings Premium
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INGREDIENTS.map((ing) => {
                const isSelected = !!selectedIngredients.find(i => i.id === ing.id);
                return (
                  <button
                    key={ing.id}
                    onClick={() => toggleIngredient(ing)}
                    className={`group relative p-3 rounded-lg text-sm border transition-all duration-300 flex flex-col items-start gap-1 overflow-hidden transform active:scale-90 ${
                      isSelected
                        ? 'bg-vivazza-stone text-white border-vivazza-stone shadow-lg scale-105 z-10'
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="font-semibold">{ing.name}</span>
                    <span className={`text-xs transition-colors ${isSelected ? 'text-vivazza-gold' : 'text-vivazza-red'}`}>+{formatCLP(ing.price)}</span>
                    
                    {isSelected && (
                      <div className="absolute -right-1 -bottom-1 opacity-20 transform rotate-12">
                        <Sparkles size={24} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column: Preview/Summary - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-premium border border-gray-100 transition-all duration-500">
            <h3 className="font-heading text-3xl text-vivazza-stone mb-6 border-b pb-2 flex items-center justify-between">
              Tu Creación
              <ChefHat className="text-gray-200" size={24} />
            </h3>
            
            <div className="space-y-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex justify-between text-sm animate-fade-in">
                <span className="text-gray-600">Base Vivazza</span>
                <span className="font-mono">{formatCLP(BASE_CUSTOM_PRICE)}</span>
              </div>
              <div className="flex justify-between text-sm transition-all">
                <span className="text-gray-800 font-medium">{selectedDough.name}</span>
                <span className="font-mono">{selectedDough.price > 0 ? `+${formatCLP(selectedDough.price)}` : '-'}</span>
              </div>
              
              {selectedIngredients.length > 0 && (
                <div className="border-t border-dashed border-gray-200 pt-2">
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Ingredientes ({selectedIngredients.length})</p>
                  <div className="space-y-1">
                    {selectedIngredients.map(ing => (
                      <div key={ing.id} className="flex justify-between text-sm animate-fade-in-up">
                        <span className="text-gray-600 truncate max-w-[150px]">{ing.name}</span>
                        <span className="font-mono text-gray-500">+{formatCLP(ing.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-200">
              <span className="text-gray-500 font-light text-sm">Total Estimado</span>
              <span className={`font-heading text-4xl text-vivazza-red transition-all duration-300 transform ${isPriceAnimating ? 'scale-110 text-vivazza-gold' : 'scale-100'}`}>
                {formatCLP(totalPrice)}
              </span>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-vivazza-red text-white py-4 rounded-xl font-heading text-xl hover:bg-red-700 active:scale-95 transition-all shadow-red flex items-center justify-center gap-2 group"
            >
              <ShoppingBag size={20} className="group-hover:animate-bounce" />
              Agregar al Carrito
            </button>
          </div>
        </div>

      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        .animate-fade-in {
          animation: fade-in-up 0.4s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default PizzaLab;