import React, { useState, useEffect } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_PHONE } from './constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from './types';
import PizzaCard from './components/PizzaCard';
import PizzaModal from './components/PizzaModal';
import PizzaLab from './components/PizzaLab';
import PizzaRush from './components/PizzaRush';
import Wholesale from './components/Wholesale';
import CartSidebar from './components/CartSidebar';
import NotFound from './components/NotFound';
import { ToastContainer } from './components/Toast';
import { ShoppingBag, UtensilsCrossed, Gamepad2, Pizza as PizzaIcon, Home, Instagram, MessageCircle, Building2 } from 'lucide-react';

type Section = 'menu' | 'lab' | 'game' | 'wholesale' | '404';

function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('vivazza_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart", e);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vivazza_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  if (!mounted) return null;

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNavChange = (section: Section) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (pizza: Pizza) => {
    const newItem: CartItem = {
      id: Date.now().toString(),
      pizzaName: pizza.name,
      basePrice: pizza.price,
      quantity: 1,
      isCustom: false
    };
    setCartItems(prev => [...prev, newItem]);
    addToast(`${pizza.name} agregada al carrito`, 'success');
  };

  const addCustomToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
    setActiveSection('menu');
  };

  const addExtraToCart = (extra: ExtraItem) => {
     const newItem: CartItem = {
      id: Date.now().toString(),
      pizzaName: extra.name,
      basePrice: extra.price,
      quantity: 1,
      isCustom: false,
      isExtra: true
    };
    setCartItems(prev => [...prev, newItem]);
    addToast(`${extra.name} agregado`, 'success');
  }

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    addToast('Producto eliminado', 'info');
  };

  return (
    <div className="min-h-screen bg-grain flex flex-col pb-24 md:pb-0">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-30 bg-vivazza-cream/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
              <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
              <span className="ml-3 text-[10px] tracking-[0.2em] text-gray-400 uppercase border-l pl-3 border-gray-300">
                Fábrica de Pizzas Artesanales
              </span>
            </div>

            <div className="flex space-x-6">
              <button onClick={() => handleNavChange('menu')} className={`font-heading text-lg transition-colors ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>CARTA</button>
              <button onClick={() => handleNavChange('lab')} className={`font-heading text-lg transition-colors ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA LAB</button>
              <button onClick={() => handleNavChange('game')} className={`font-heading text-lg transition-colors ${activeSection === 'game' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA BREAKER</button>
              <button onClick={() => handleNavChange('wholesale')} className={`font-heading text-lg transition-colors ${activeSection === 'wholesale' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>MAYORISTAS</button>
            </div>

            <div className="flex items-center gap-6">
               <a href={`https://instagram.com/${VIVAZZA_INSTAGRAM}`} target="_blank" className="text-vivazza-stone hover:text-vivazza-red transition-colors">
                  <Instagram size={22} />
               </a>
               <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-vivazza-stone group">
                <ShoppingBag size={28} className="group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span 
                    key={cartItems.length}
                    className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-vivazza-red rounded-full ring-2 ring-white animate-cart-pop"
                  >
                    {cartItems.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-6 h-16 bg-vivazza-cream/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
         <h1 className="font-heading text-3xl text-vivazza-red tracking-tight" onClick={() => handleNavChange('menu')}>VIVAZZA</h1>
         <div className="flex gap-4">
            <a href={`https://wa.me/${VIVAZZA_PHONE}`} className="text-green-600"><MessageCircle size={24} /></a>
            <a href={`https://instagram.com/${VIVAZZA_INSTAGRAM}`} className="text-vivazza-stone"><Instagram size={24} /></a>
         </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {activeSection === 'menu' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="relative rounded-[2.5rem] overflow-hidden bg-vivazza-stone text-white p-6 md:p-16 mb-8 shadow-premium group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-transparent z-10"></div>
              <div className="relative z-20 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-vivazza-red text-white text-[10px] font-black rounded-full mb-4 uppercase tracking-[0.2em]">Pizzas Congeladas Listas para Hornear</span>
                <h2 className="font-heading text-6xl md:text-8xl mb-4 leading-none text-white tracking-tighter">FABRICA DE <br/><span className="text-vivazza-red">PIZZAS</span></h2>
                <p className="font-medium text-gray-300 text-lg mb-8 max-w-md">Elaboramos pizzas artesanales prehorneadas congeladas. Ingredientes premium y receta única para disfrutar en casa con solo hornear.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => handleNavChange('menu')} className="bg-vivazza-red text-white px-10 py-4 rounded-2xl font-heading text-2xl shadow-red flex items-center gap-3 active:scale-95 duration-200">
                    VER CATÁLOGO
                  </button>
                  <button onClick={() => handleNavChange('wholesale')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-heading text-2xl flex items-center gap-3 active:scale-95 duration-200">
                    VENTA MAYORISTA
                  </button>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1950&q=80" alt="Pizza artesanal" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
            </div>

            <section>
              <div className="flex justify-between items-end mb-8">
                <h3 className="font-heading text-4xl text-vivazza-stone uppercase tracking-tight">Nuestro Catálogo</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-4 py-1 rounded-full">Talca, Chile</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {PIZZAS.map((pizza, index) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={index} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'lab' && <PizzaLab onAddToCart={addCustomToCart} showToast={addToast} />}
        {activeSection === 'game' && <PizzaRush onWinCoupon={(c) => {setAppliedCoupon(c); addToast("¡Descuento ganado!", "success"); setIsCartOpen(true);}} />}
        {activeSection === 'wholesale' && <Wholesale />}
        {activeSection === '404' && <NotFound onBack={() => handleNavChange('menu')} />}

      </main>

      {/* Bottom Nav Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-2 pb-safe-bottom z-40 flex justify-between items-center">
        <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-[10px] font-bold">Carta</span>
        </button>
        <button onClick={() => handleNavChange('lab')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <PizzaIcon size={24} />
          <span className="text-[10px] font-bold">Lab</span>
        </button>
        <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'game' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Gamepad2 size={24} />
          <span className="text-[10px] font-bold">Jugar</span>
        </button>
        <button onClick={() => handleNavChange('wholesale')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'wholesale' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Building2 size={24} />
          <span className="text-[10px] font-bold">Venta</span>
        </button>
        {/* Adición del contador en el botón de pedido del footer si fuera necesario, 
            pero el usuario pidió header/sidebar. Mantenemos consistencia con la versión móvil. */}
        <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 p-2 relative text-gray-400">
           <div className="relative">
              <ShoppingBag size={24} />
              {cartItems.length > 0 && (
                <span 
                  key={cartItems.length}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-vivazza-red text-[9px] font-bold text-white animate-cart-pop"
                > 
                  {cartItems.length} 
                </span>
              )}
           </div>
           <span className="text-[10px] font-bold">Pedido</span>
        </button>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={addExtraToCart} showToast={addToast} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
    </div>
  );
}

export default App;