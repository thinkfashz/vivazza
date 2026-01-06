
"use client";
import React, { useState, useEffect } from 'react';
import { Dough, Ingredient, CartItem, ToastType } from '../types';
import { DOUGHS, INGREDIENTS, BASE_CUSTOM_PRICE } from '../constants';
import { formatCLP } from '../utils';
import { Plus, Sparkles, ShoppingBag } from 'lucide-react';

// Constructor de pizzas personalizadas
interface PizzaLabProps {
  onAddToCart: (item: CartItem) => void;
  showToast: (msg: string, type: ToastType) => void;
}

const PizzaLab: React.FC<PizzaLabProps> = ({ onAddToCart, showToast }) => {
  const [selectedDough, setSelectedDough] = useState<Dough>(DOUGHS[0]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [totalPrice, setTotalPrice] = useState(BASE_CUSTOM_PRICE);

  useEffect(() => {
    const ingredientsCost = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
    setTotalPrice(BASE_CUSTOM_PRICE + selectedDough.price + ingredientsCost);
  }, [selectedDough, selectedIngredients]);

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.find(i => i.id === ingredient.id)) {
      setSelectedIngredients(prev => prev.filter(i => i.id !== ingredient.id));
    } else {
      setSelectedIngredients(prev => [...prev, ingredient]);
    }
  };

  const handleAddToCart = () => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      pizzaName: 'Custom Pizza Lab',
      basePrice: totalPrice,
      quantity: 1,
      isCustom: true,
      dough: selectedDough,
      customIngredients: selectedIngredients
    };
    onAddToCart(newItem);
    showToast('¡Tu creación ha sido enviada al carrito!', 'success');
  };

  return (
    <div className="animate-fade-in-up">
      <div className="bg-vivazza-stone text-white rounded-[2.5rem] p-8 md:p-12 mb-12 shadow-premium relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-vivazza-red opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-5xl md:text-7xl mb-4 leading-none uppercase">PIZZA <span className="text-vivazza-red">LAB</span></h2>
            <p className="text-gray-400 font-medium max-w-md">Diseña tu propia obra maestra artesanal. Elige la base y los ingredientes más frescos.</p>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 text-center min-w-[240px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Precio Estimado</p>
            <p className="font-heading text-5xl text-vivazza-gold leading-none">{formatCLP(totalPrice)}</p>
            <button 
              onClick={handleAddToCart}
              className="mt-6 w-full bg-vivazza-red text-white py-4 rounded-xl font-heading text-xl shadow-red active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={20} /> AGREGAR A MI PEDIDO
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 sticky top-24">
             <h3 className="font-heading text-2xl mb-6 text-vivazza-stone uppercase border-b pb-4">Tu Creación</h3>
             <div className="relative w-full aspect-square bg-vivazza-cream rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                <div className="w-[85%] h-[85%] rounded-full bg-orange-100 shadow-inner flex items-center justify-center border-4 border-orange-200">
                    <div className="w-[90%] h-[90%] rounded-full bg-vivazza-red/20 flex flex-wrap items-center justify-center p-4 gap-2">
                       {selectedIngredients.map(ing => (
                         <div key={ing.id} className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: ing.color || '#ccc' }} title={ing.name} />
                       ))}
                       {selectedIngredients.length === 0 && <p className="text-vivazza-stone/30 text-xs font-bold uppercase text-center">Selecciona ingredientes</p>}
                    </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-vivazza-stone text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  MASA: {selectedDough.name.toUpperCase()}
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-6">
               <Sparkles className="text-vivazza-gold" size={24} />
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">1. Elige tu Masa</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DOUGHS.map(dough => (
                <button 
                  key={dough.id}
                  onClick={() => setSelectedDough(dough)}
                  className={`flex flex-col p-5 rounded-2xl border-2 transition-all text-left ${selectedDough.id === dough.id ? 'border-vivazza-red bg-red-50 shadow-md' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading text-xl text-vivazza-stone">{dough.name}</span>
                    <span className="font-bold text-vivazza-red text-sm">{dough.price > 0 ? `+${formatCLP(dough.price)}` : 'Gratis'}</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-snug">{dough.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
               <Plus className="text-vivazza-gold" size={24} />
               <h3 className="font-heading text-3xl text-vivazza-stone uppercase">2. Agrega Ingredientes</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {INGREDIENTS.map(ingredient => {
                const isSelected = selectedIngredients.find(i => i.id === ingredient.id);
                return (
                  <button 
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 ${isSelected ? 'border-vivazza-red bg-red-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                  >
                    <div className="w-10 h-10 rounded-full shadow-inner mb-1" style={{ backgroundColor: ingredient.color || '#eee' }} />
                    <span className="text-[11px] font-bold text-vivazza-stone leading-tight uppercase">{ingredient.name}</span>
                    <span className="text-[10px] text-vivazza-red font-bold">{formatCLP(ingredient.price)}</span>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-vivazza-red text-white p-1 rounded-full shadow-lg">
                        <Plus size={12} className="rotate-45" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// Se agrega exportación por defecto para corregir error de importación
export default PizzaLab;
