import React, { useState } from 'react';
import { PIZZAS } from './constants';
import { Pizza, CartItem } from './types';
import PizzaCard from './components/PizzaCard';
import PizzaModal from './components/PizzaModal';
import PizzaLab from './components/PizzaLab';
import PizzaRush from './components/PizzaRush';
import CartSidebar from './components/CartSidebar';
import { ShoppingBag, UtensilsCrossed, ChefHat, Gamepad2, Menu } from 'lucide-react';

type Section = 'menu' | 'lab' | 'game';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Filtering pizzas
  const traditionalPizzas = PIZZAS.filter(p => p.type === 'traditional');
  const specialPizzas = PIZZAS.filter(p => p.type === 'special');

  const addToCart = (pizza: Pizza) => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      pizzaName: pizza.name,
      basePrice: pizza.price,
      quantity: 1,
      isCustom: false
    };
    setCartItems(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const addCustomToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
    setActiveSection('menu'); // Return to menu after adding custom
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const openDetails = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-grain flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 bg-vivazza-cream/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => setActiveSection('menu')}>
              <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
              <span className="hidden sm:block ml-3 text-xs tracking-[0.2em] text-gray-500 uppercase border-l pl-3 border-gray-300">
                Artesanal Moderno
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              <button 
                onClick={() => setActiveSection('menu')}
                className={`font-heading text-lg tracking-wide transition-colors ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}
              >
                CARTA
              </button>
              <button 
                onClick={() => setActiveSection('lab')}
                className={`font-heading text-lg tracking-wide transition-colors ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}
              >
                PIZZA LAB
              </button>
              <button 
                onClick={() => setActiveSection('game')}
                className={`font-heading text-lg tracking-wide transition-colors ${activeSection === 'game' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}
              >
                PIZZA RUSH
              </button>
            </div>

            {/* Cart Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-vivazza-stone hover:text-vivazza-red transition-colors"
            >
              <ShoppingBag size={28} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-vivazza-red rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Submenu for active section indicator if needed, simpler to just rely on content swap */}
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {activeSection === 'menu' && (
          <div className="space-y-16 animate-fade-in-up">
            {/* Hero Banner (Mini) */}
            <div className="relative rounded-3xl overflow-hidden bg-vivazza-stone text-white p-8 md:p-12 mb-12 shadow-premium">
              <div className="relative z-10 max-w-2xl">
                <span className="text-vivazza-gold font-bold tracking-widest text-sm uppercase mb-2 block">Desde Talca con amor</span>
                <h2 className="font-heading text-5xl md:text-6xl mb-4 leading-none">El sabor de la <br/>verdadera masa madre</h2>
                <p className="font-light text-gray-300 text-lg mb-8 max-w-lg">
                  Nacidos en 2021 cerca de la Diagonal. Ingredientes locales, técnicas italianas y pasión por lo bien hecho.
                </p>
                <button onClick={() => setActiveSection('lab')} className="bg-vivazza-red text-white px-8 py-3 rounded-full font-heading text-xl hover:bg-red-700 transition-colors shadow-red">
                  Crea tu Pizza
                </button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Pizza Background"
                className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay"
              />
            </div>

            {/* Special Section */}
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                <div>
                  <h3 className="font-heading text-4xl text-vivazza-stone">Especialidades de Autor</h3>
                  <p className="text-gray-500 font-light mt-1">Sabores audaces diseñados por nuestros chefs.</p>
                </div>
                <UtensilsCrossed className="text-gray-300 hidden sm:block" size={32} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {specialPizzas.map(pizza => (
                  <PizzaCard 
                    key={pizza.id} 
                    pizza={pizza} 
                    onAdd={addToCart}
                    onViewDetails={openDetails}
                  />
                ))}
              </div>
            </section>

            {/* Traditional Section */}
            <section>
              <div className="flex items-end justify-between mb-8 border-b border-gray-200 pb-4">
                <div>
                  <h3 className="font-heading text-4xl text-vivazza-stone">Clásicos Tradicionales</h3>
                  <p className="text-gray-500 font-light mt-1">Las recetas que nunca fallan, perfeccionadas.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {traditionalPizzas.map(pizza => (
                  <PizzaCard 
                    key={pizza.id} 
                    pizza={pizza} 
                    onAdd={addToCart}
                    onViewDetails={openDetails}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'lab' && (
          <PizzaLab onAddToCart={addCustomToCart} />
        )}

        {activeSection === 'game' && (
          <div className="animate-fade-in-up py-10 flex flex-col items-center">
             <div className="text-center mb-8">
               <Gamepad2 size={48} className="mx-auto text-vivazza-red mb-4" />
               <h2 className="font-heading text-5xl text-vivazza-stone">Pizza Rush</h2>
               <p className="text-gray-500 mt-2">¡Haz tiempo mientras preparamos tu orden!</p>
             </div>
             <PizzaRush />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-vivazza-stone text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl text-white mb-4">VIVAZZA</h2>
          <p className="font-light text-sm mb-6">Talca, Región del Maule.</p>
          <div className="flex justify-center gap-4 text-xs tracking-wider uppercase">
            <span>Instagram</span>
            <span>•</span>
            <span>Facebook</span>
            <span>•</span>
            <span>Contacto</span>
          </div>
          <p className="mt-8 text-xs opacity-50">© 2024 Vivazza Pizzería. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* Modals */}
      <PizzaModal 
        pizza={selectedPizza} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addToCart}
      />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}

export default App;