import React, { useState, useEffect } from 'react';
import { DOUGHS, INGREDIENTS, BASE_CUSTOM_PRICE } from '../constants';
import { Dough, Ingredient, CartItem } from '../types';
import { formatCLP } from '../utils';
import { Check, ChefHat, ShoppingBag, RotateCcw, Flame } from 'lucide-react';

interface PizzaLabProps {
  onAddToCart: (item: CartItem) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

const PizzaLab: React.FC<PizzaLabProps> = ({ onAddToCart, showToast }) => {
  const [selectedDough, setSelectedDough] = useState<Dough>(DOUGHS[0]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  useEffect(() => {
    const ingredientsPrice = selectedIngredients.reduce((sum, ing) => sum + ing.price, 0);
    const ingredientsCalories = selectedIngredients.reduce((sum, ing) => sum + ing.calories, 0);
    
    setTotalPrice(BASE_CUSTOM_PRICE + selectedDough.price + ingredientsPrice);
    setTotalCalories(selectedDough.calories + ingredientsCalories);
  }, [selectedDough, selectedIngredients]);

  const toggleIngredient = (ingredient: Ingredient) => {
    if (selectedIngredients.find(i => i.id === ingredient.id)) {
      setSelectedIngredients(prev => prev.filter(i => i.id !== ingredient.id));
    } else {
      if (selectedIngredients.length >= 7) {
        showToast("¡Wow! Esa pizza va a explotar. Máximo 7 ingredientes.", 'error');
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
    showToast("¡Tu creación ha sido añadida al carrito!", 'success');
  };

  const resetBuilder = () => {
    setSelectedDough(DOUGHS[0]);
    setSelectedIngredients([]);
  };

  // Visual helper for ingredients positioning
  const getIngredientStyle = (index: number, total: number) => {
    // Distribute randomly within circle
    const r = 20 + Math.random() * 30; // Radius %
    const theta = (index / total) * 2 * Math.PI; // Angle
    const x = 50 + r * Math.cos(theta);
    const y = 50 + r * Math.sin(theta);
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-fade-in-up">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-3 bg-vivazza-red/10 rounded-full mb-4">
          <ChefHat size={32} className="text-vivazza-red" />
        </div>
        <h2 className="text-5xl font-heading text-vivazza-stone mb-2">Pizza Lab</h2>
        <p className="text-gray-500 font-light">Diseña tu propia experiencia. Precio base: {formatCLP(BASE_CUSTOM_PRICE)}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Config */}
        <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
          
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
                  className={`relative p-4 rounded-xl text-left border-2 transition-all ${
                    selectedDough.id === dough.id 
                      ? 'border-vivazza-red bg-white shadow-red' 
                      : 'border-transparent bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-vivazza-stone">{dough.name}</span>
                    {dough.price > 0 && <span className="text-xs font-bold text-vivazza-red">+{formatCLP(dough.price)}</span>}
                  </div>
                  <p className="text-xs text-gray-500">{dough.description}</p>
                  <div className="flex items-center gap-1 mt-2 text-[10px] text-orange-500 font-bold uppercase tracking-wider">
                    <Flame size={10} />
                    {dough.calories} kcal
                  </div>
                  {selectedDough.id === dough.id && (
                    <div className="absolute top-2 right-2 text-vivazza-red">
                      <Check size={16} />
                    </div>
                  )}
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
                    className={`p-3 rounded-lg text-sm border transition-all flex flex-col items-start gap-1 relative overflow-hidden ${
                      isSelected
                        ? 'bg-vivazza-stone text-white border-vivazza-stone shadow-lg scale-105'
                        : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 z-10">
                      <div className="w-3 h-3 rounded-full border border-white/20" style={{backgroundColor: ing.color}}></div>
                      <span className="font-semibold">{ing.name}</span>
                    </div>
                    <div className="flex items-center justify-between w-full z-10">
                      <span className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-vivazza-red'} font-bold`}>+{formatCLP(ing.price)}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-gray-400' : 'text-orange-400'}`}>{ing.calories} kcal</span>
                    </div>
                    {isSelected && <Check className="absolute top-2 right-2 text-white/20" size={32} />}
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* Right Column: Visual Preview & Summary - Sticky */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-24 space-y-6">
            
            {/* Visual Builder (Level 2) */}
            <div className="bg-white p-4 rounded-2xl shadow-premium aspect-square relative flex items-center justify-center overflow-hidden border border-gray-100 group">
                {/* Plate */}
                <div className="w-[90%] h-[90%] rounded-full bg-gray-100 shadow-inner flex items-center justify-center relative">
                   {/* Dough */}
                   <div className="w-[90%] h-[90%] rounded-full bg-[#f3dcb8] shadow-md border-4 border-[#eecba0] relative transition-all duration-500"
                        style={{
                           backgroundColor: selectedDough.id === 'whole' ? '#d4bba0' : '#f3dcb8',
                           borderColor: selectedDough.id === 'cheese' ? '#fac661' : '#eecba0'
                        }}>
                        {/* Sauce */}
                        <div className="absolute inset-4 rounded-full bg-red-600/80 opacity-90"></div>
                        
                        {/* Ingredients Layer */}
                        {selectedIngredients.map((ing, idx) => (
                           <React.Fragment key={ing.id + idx}>
                             {/* Generating 3 visual bits per ingredient for coverage */}
                             {[0, 1, 2].map((bit) => {
                               const style = getIngredientStyle(idx * 3 + bit, selectedIngredients.length * 3);
                               return (
                                 <div 
                                  key={bit}
                                  className="absolute w-4 h-4 rounded-full shadow-sm animate-fade-in-up transform -translate-x-1/2 -translate-y-1/2"
                                  style={{
                                    backgroundColor: ing.color,
                                    ...style,
                                    zIndex: 10 + idx
                                  }}
                                  title={ing.name}
                                 />
                               );
                             })}
                           </React.Fragment>
                        ))}
                   </div>
                </div>
                
                {/* Real-time Calories Badge on Visualizer */}
                <div className="absolute top-6 left-6 bg-orange-50 border border-orange-100 text-orange-600 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm animate-fade-in-up">
                  <Flame size={14} className="animate-pulse" />
                  <span className="text-xs font-bold">{totalCalories} kcal</span>
                </div>

                {selectedIngredients.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-gray-400">
                      Añade ingredientes
                    </span>
                  </div>
                )}
                <button 
                  onClick={resetBuilder}
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow hover:bg-gray-50 text-gray-500"
                  title="Reiniciar"
                >
                  <RotateCcw size={16}/>
                </button>
            </div>

            {/* Summary Card */}
            <div className="bg-white p-6 rounded-2xl shadow-premium border border-gray-100">
              <h3 className="font-heading text-3xl text-vivazza-stone mb-6 border-b pb-2">Tu Creación</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Base Vivazza</span>
                  <span className="font-mono">{formatCLP(BASE_CUSTOM_PRICE)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-800 font-medium">{selectedDough.name}</span>
                  <span className="font-mono">{selectedDough.price > 0 ? `+${formatCLP(selectedDough.price)}` : '-'}</span>
                </div>
                
                {selectedIngredients.length > 0 && (
                  <div className="border-t border-dashed border-gray-200 pt-2 max-h-40 overflow-y-auto custom-scrollbar">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">Ingredientes ({selectedIngredients.length})</p>
                    {selectedIngredients.map(ing => (
                      <div key={ing.id} className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 truncate max-w-[150px]">{ing.name}</span>
                        <span className="font-mono text-gray-500">+{formatCLP(ing.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-6 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between items-center text-orange-500">
                  <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                    <Flame size={12} /> Energía Total
                  </span>
                  <span className="font-mono font-bold">{totalCalories} kcal</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-500 font-light text-sm">Total Estimado</span>
                  <span className="font-heading text-4xl text-vivazza-red">{formatCLP(totalPrice)}</span>
                </div>
              </div>

              <button
                onClick={handleAdd}
                className="w-full bg-vivazza-red text-white py-4 rounded-xl font-heading text-xl hover:bg-red-700 transition-colors shadow-red flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PizzaLab;