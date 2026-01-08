
"use client";
import React, { useState, useEffect } from 'react';
import { Dough, Ingredient, CartItem, ToastType } from '../types';
import { DOUGHS, INGREDIENTS, BASE_CUSTOM_PRICE } from '../constants';
import { formatCLP } from '../utils';
import { Plus, Sparkles, ShoppingBag, Info } from 'lucide-react';

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
    onAddToCart({
      id: Date.now().toString(),
      pizzaName: 'Pizza Lab Personalizada',
      basePrice: totalPrice,
      quantity: 1,
      isCustom: true,
      dough: selectedDough,
      customIngredients: selectedIngredients
    });
    showToast('¡Tu creación artesanal está en el carrito!', 'success');
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 mb-12 shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="font-heading text-5xl md:text-7xl mb-2 text-vivazza-stone uppercase leading-none">PIZZA <span className="text-vivazza-red">LAB</span></h2>
          <p className="text-gray-500 font-medium max-w-md">Diseña tu obra maestra. Masa madre estirada a mano e ingredientes premium.</p>
        </div>
        <div className="bg-vivazza-cream border border-vivazza-gold/20 rounded-[2.5rem] p-8 text-center min-w-[280px] shadow-inner">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total (IVA incluido)</p>
          <p className="font-heading text-6xl text-vivazza-red leading-none">{formatCLP(totalPrice)}</p>
          <button onClick={handleAddToCart} className="mt-6 w-full bg-vivazza-red text-white py-4 rounded-2xl font-heading text-2xl shadow-red active:scale-95 transition-all flex items-center justify-center gap-3">
            <ShoppingBag size={22} /> PEDIR MI CREACIÓN
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Simulador Realista */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full max-w-md">
            <div className="relative w-full aspect-square bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner flex items-center justify-center p-8 overflow-hidden">
               {/* Sombra de la pizza */}
               <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.05)_0%,transparent_70%)] pointer-events-none" />
               
               {/* Masa (Dough) */}
               <div className="relative w-full h-full rounded-full bg-[#E5BA73] border-[12px] border-[#C69749] shadow-2xl transition-all duration-500 transform group hover:rotate-6">
                  {/* Salsa de Tomate */}
                  <div className="absolute inset-4 rounded-full bg-[#A61D24] opacity-90 border-4 border-[#8B151A]" />
                  
                  {/* Renderizado de Ingredientes "Realistas" */}
                  <div className="absolute inset-6">
                    {selectedIngredients.map((ing, idx) => (
                      <div key={ing.id} className="absolute w-full h-full">
                         {[...Array(6)].map((_, i) => (
                            <div 
                              key={i} 
                              className="absolute w-8 h-8 rounded-full shadow-md transition-all duration-700 animate-in zoom-in fade-in"
                              style={{ 
                                backgroundColor: ing.color, 
                                left: `${20 + (Math.sin(i + idx) * 35 + 35)}%`, 
                                top: `${20 + (Math.cos(i + idx) * 35 + 35)}%`,
                                transform: `rotate(${i * 60}deg) scale(${0.8 + Math.random() * 0.4})`,
                                opacity: 0.95,
                                border: '1px solid rgba(0,0,0,0.1)'
                              }} 
                            />
                         ))}
                      </div>
                    ))}
                  </div>
                  
                  {/* Queso Fundido (Simulado) */}
                  <div className="absolute inset-6 rounded-full bg-[#FDE68A]/30 mix-blend-overlay" />
               </div>
               
               <div className="absolute bottom-10 bg-vivazza-stone text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest">
                 Masa: {selectedDough.name}
               </div>
            </div>
            
            <div className="mt-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4 items-start">
              <span className="text-blue-500 flex-shrink-0"><Info size={20} /></span>
              <p className="text-xs text-blue-700 font-medium leading-relaxed">Cada pizza es preparada artesanalmente. El aspecto final puede variar ligeramente, pero el sabor es siempre premium.</p>
            </div>
          </div>
        </div>

        {/* Opciones de Selección */}
        <div className="lg:col-span-7 space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-vivazza-red text-white rounded-xl"><Sparkles size={20} /></div>
               <h3 className="font-heading text-4xl text-vivazza-stone uppercase">1. Selecciona tu Masa</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DOUGHS.map(dough => (
                <button 
                  key={dough.id}
                  onClick={() => setSelectedDough(dough)}
                  className={`flex flex-col p-6 rounded-[2rem] border-2 transition-all text-left group ${selectedDough.id === dough.id ? 'border-vivazza-red bg-red-50 shadow-lg' : 'border-gray-100 bg-white hover:border-vivazza-gold/30'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading text-2xl text-vivazza-stone">{dough.name}</span>
                    <span className="font-bold text-vivazza-red text-xs">{dough.price > 0 ? `+${formatCLP(dough.price)}` : 'Incluido'}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-medium leading-snug">{dough.description}</p>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-vivazza-red text-white rounded-xl"><Plus size={20} /></div>
               <h3 className="font-heading text-4xl text-vivazza-stone uppercase">2. Agrega Ingredientes</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {INGREDIENTS.map(ingredient => {
                const isSelected = selectedIngredients.find(i => i.id === ingredient.id);
                return (
                  <button 
                    key={ingredient.id}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`relative p-5 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-3 active:scale-95 ${isSelected ? 'border-vivazza-red bg-red-50 shadow-md scale-105' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                  >
                    <div className="w-12 h-12 rounded-full shadow-lg border-4 border-white" style={{ backgroundColor: ingredient.color }} />
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-vivazza-stone leading-none uppercase tracking-tighter">{ingredient.name}</p>
                      <p className="text-[10px] text-vivazza-red font-bold">{formatCLP(ingredient.price)}</p>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-vivazza-red text-white p-1.5 rounded-full shadow-xl">
                        <Plus size={14} className="rotate-45" />
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

export default PizzaLab;
