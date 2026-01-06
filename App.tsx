
import React, { useState, useEffect } from 'react';
import { PIZZAS } from './constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from './types';
import PizzaCard from './components/PizzaCard';
import PizzaModal from './components/PizzaModal';
import PizzaLab from './components/PizzaLab';
import PizzaRush from './components/PizzaRush';
import CartSidebar from './components/CartSidebar';
import NotFound from './components/NotFound';
import { ToastContainer } from './components/Toast';
import { ShoppingBag, UtensilsCrossed, Gamepad2, Pizza as PizzaIcon, Home } from 'lucide-react';

type Section = 'menu' | 'lab' | 'game' | '404';

function App() {
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  useEffect(() => {
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
    localStorage.setItem('vivazza_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const titles: Record<Section, string> = {
      menu: 'Vivazza | Carta Artesanal',
      lab: 'Vivazza | Pizza Lab Builder',
      game: 'Vivazza | Pizza Breaker Game',
      '404': 'Vivazza | Error 404'
    };
    document.title = titles[activeSection] || 'Vivazza Pizzería';
  }, [activeSection]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const traditionalPizzas = PIZZAS.filter(p => p.type === 'traditional');
  const specialPizzas = PIZZAS.filter(p => p.type === 'special');

  const vibrate = () => {
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const handleNavChange = (section: Section) => {
    vibrate();
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

  const openDetails = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsModalOpen(true);
  };

  const handleGameWin = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    addToast(`¡Victoria! Cupón ${coupon.code} aplicado.`, 'success');
    setTimeout(() => {
      setIsCartOpen(true);
    }, 1500);
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
              <span className="ml-3 text-xs tracking-[0.2em] text-gray-500 uppercase border-l pl-3 border-gray-300">
                Artesanal Moderno
              </span>
            </div>

            <div className="flex space-x-8">
              <button onClick={() => handleNavChange('menu')} className={`font-heading text-lg transition-colors ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>CARTA</button>
              <button onClick={() => handleNavChange('lab')} className={`font-heading text-lg transition-colors ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA LAB</button>
              <button onClick={() => handleNavChange('game')} className={`font-heading text-lg transition-colors ${activeSection === 'game' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA BREAKER</button>
            </div>

            <button onClick={() => { setIsCartOpen(true); vibrate(); }} className="relative p-2 text-vivazza-stone group">
              <ShoppingBag size={28} className="group-hover:scale-110 transition-transform" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-vivazza-red rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-center h-16 bg-vivazza-cream/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-20">
         <h1 className="font-heading text-3xl text-vivazza-red tracking-tight" onClick={() => handleNavChange('menu')}>VIVAZZA</h1>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {activeSection === 'menu' && (
          <div className="space-y-12 animate-fade-in-up">
            <div className="relative rounded-3xl overflow-hidden bg-vivazza-stone text-white p-6 md:p-12 mb-8 shadow-premium group cursor-pointer" onClick={() => handleNavChange('lab')}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
              <div className="relative z-20 max-w-2xl">
                <span className="inline-block px-3 py-1 bg-vivazza-gold text-vivazza-stone text-xs font-bold rounded-full mb-3 uppercase tracking-widest shadow-lg">Top Seller Talca</span>
                <h2 className="font-heading text-5xl md:text-7xl mb-4 leading-none text-white drop-shadow-lg">¿Hambre de <br/><span className="text-vivazza-red">Verdad?</span></h2>
                <p className="font-medium text-gray-200 text-lg mb-6 max-w-md drop-shadow-md">Olvídate de las pizzas industriales. Prueba la verdadera masa madre.</p>
                <button className="bg-vivazza-red text-white px-8 py-4 rounded-xl font-heading text-xl shadow-red flex items-center gap-2 active:scale-95 duration-200">
                  <UtensilsCrossed size={20} /> PEDIR AHORA
                </button>
              </div>
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1950&q=80" alt="Pizza" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
            </div>

            <section>
              <h3 className="font-heading text-4xl text-vivazza-stone mb-6">Firmas de Autor</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {specialPizzas.map(pizza => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={openDetails} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="font-heading text-4xl text-vivazza-stone mb-6 mt-8">Clásicos Italianos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {traditionalPizzas.map(pizza => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={openDetails} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'lab' && <PizzaLab onAddToCart={addCustomToCart} showToast={addToast} />}
        {activeSection === 'game' && <PizzaRush onWinCoupon={handleGameWin} />}
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
          <span className="text-[10px] font-bold">Crear</span>
        </button>
        <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'game' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Gamepad2 size={24} />
          <span className="text-[10px] font-bold">Jugar</span>
        </button>
        <button onClick={() => { setIsCartOpen(true); vibrate(); }} className="flex flex-col items-center gap-1 p-2 relative text-gray-400">
          <div className="relative">
            <ShoppingBag size={24} />
            {cartItems.length > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-vivazza-red text-[9px] font-bold text-white"> {cartItems.length} </span>}
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
