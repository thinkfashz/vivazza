
import React, { useState, useEffect, useMemo } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_PHONE, VIVAZZA_CATALOG_URL, VIVAZZA_LOCATION, REVIEWS } from './constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from './types';
import PizzaCard from './components/PizzaCard';
import PizzaModal from './components/PizzaModal';
import PizzaRush from './components/PizzaRush';
import Wholesale from './components/Wholesale';
import PizzaCatalog from './components/PizzaCatalog';
import CartSidebar from './components/CartSidebar';
import NotFound from './components/NotFound';
import { ToastContainer } from './components/Toast';
import { ShoppingBag, Gamepad2, Pizza as PizzaIcon, Home, Instagram, MessageCircle, Building2, MapPin, Phone, ExternalLink, Star, Quote, Clock, Truck, List, ChevronRight } from 'lucide-react';

type Section = 'menu' | 'catalog' | 'wholesale' | 'game' | '404';

function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const traditionalPizzas = useMemo(() => PIZZAS.filter(p => p.type === 'traditional'), []);
  const specialPizzas = useMemo(() => PIZZAS.filter(p => p.type === 'special'), []);

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

  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const playUISound = (freq = 880) => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleNavChange = (section: Section) => {
    hapticFeedback();
    playUISound(660);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (url: string) => {
    hapticFeedback();
    playUISound(1000);
    window.open(url, '_blank');
  };

  const addToCart = (pizza: Pizza) => {
    hapticFeedback();
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
    <div className="min-h-screen bg-grain flex flex-col pb-24 md:pb-0 select-none overflow-x-hidden">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      {/* Desktop Navbar */}
      <nav className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
            <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
            <span className="ml-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">TALCA // MASA MADRE</span>
          </div>

          <div className="flex space-x-10">
            {['menu', 'catalog', 'wholesale', 'game'].map((sec) => (
              <button key={sec} onClick={() => handleNavChange(sec as Section)} className={`font-heading text-xl uppercase tracking-tight transition-all duration-300 ${activeSection === sec ? 'text-vivazza-red scale-110' : 'text-vivazza-stone hover:text-vivazza-red opacity-60 hover:opacity-100'}`}>
                {sec === 'wholesale' ? 'Distribución al Mayor' : sec === 'game' ? 'Jugar' : sec === 'catalog' ? 'Catálogo' : 'Inicio'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleSocialClick(`https://instagram.com/${VIVAZZA_INSTAGRAM}`)} className="text-vivazza-stone hover:text-vivazza-red transition-all hover:scale-110"><Instagram size={24} /></button>
            <button onClick={() => { playUISound(880); setIsCartOpen(true); hapticFeedback(); }} className="relative bg-vivazza-red text-white p-3 rounded-2xl shadow-red hover:scale-105 active:scale-95 transition-all">
              <ShoppingBag size={24} />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ring-2 ring-white animate-cart-pop">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8">
        {activeSection === 'menu' && (
          <div className="space-y-16 md:space-y-24 animate-fade-in-up">
            {/* Hero Mobile Optimized */}
            <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-vivazza-stone h-[60vh] md:h-[70vh] flex items-center p-6 md:p-20 shadow-premium">
              <div className="relative z-20 max-w-3xl">
                <span className="inline-block px-3 py-1 bg-vivazza-red text-white text-[9px] font-black rounded-full mb-4 uppercase tracking-widest">Artesanal & Premium</span>
                <h2 className="font-heading text-6xl md:text-9xl mb-4 md:mb-6 leading-none text-white tracking-tighter uppercase">EL SABOR DE <br/><span className="text-vivazza-red">LA PACIENCIA</span></h2>
                <p className="text-gray-300 text-base md:text-xl font-medium mb-8 md:mb-12 max-w-lg leading-relaxed opacity-90">Fermentamos nuestra masa por 48 horas para lograr una ligereza y crunch inigualables.</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button onClick={() => handleNavChange('catalog')} className="bg-vivazza-red text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-heading text-xl md:text-2xl shadow-red active:scale-95 transition-all">VER CATÁLOGO</button>
                  <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="bg-green-600/20 backdrop-blur-md text-green-500 border border-green-500/30 px-8 md:px-12 py-4 md:py-5 rounded-2xl font-heading text-xl md:text-2xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    <MessageCircle size={22} /> PEDIR POR WA
                  </button>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1950&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Hero Vivazza" />
            </div>

            {/* Quick Menu Selection */}
            <section>
              <div className="flex justify-between items-end mb-8 px-2">
                <h3 className="font-heading text-4xl md:text-5xl text-vivazza-stone uppercase leading-none">LO <span className="text-vivazza-red">MÁS PEDIDO</span></h3>
                <button onClick={() => handleNavChange('catalog')} className="text-vivazza-red font-black uppercase tracking-widest text-[9px] flex items-center gap-1 hover:opacity-70">Ver todos <ChevronRight size={14} /></button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {specialPizzas.concat(traditionalPizzas).slice(0, 3).map((pizza, idx) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={idx} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && <PizzaCatalog onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} />}
        {activeSection === 'wholesale' && <Wholesale />}
        {activeSection === 'game' && <PizzaRush onWinCoupon={(c) => {setAppliedCoupon(c); addToast("¡Descuento ganado!", "success"); setIsCartOpen(true);}} />}
        {activeSection === '404' && <NotFound onBack={() => handleNavChange('menu')} />}
      </main>

      {/* Bottom Navigation Bar (Mobile Native Style) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center px-2 py-3 pb-safe-bottom">
          <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${activeSection === 'menu' ? 'text-vivazza-red translate-y-[-4px]' : 'text-gray-400'}`}>
            <Home size={22} strokeWidth={activeSection === 'menu' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Inicio</span>
          </button>
          <button onClick={() => handleNavChange('catalog')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${activeSection === 'catalog' ? 'text-vivazza-red translate-y-[-4px]' : 'text-gray-400'}`}>
            <List size={22} strokeWidth={activeSection === 'catalog' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Carta</span>
          </button>
          
          {/* Central Wholesale Button */}
          <button onClick={() => handleNavChange('wholesale')} className={`relative -mt-10 flex flex-col items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all active:scale-90 ${activeSection === 'wholesale' ? 'bg-vivazza-stone text-vivazza-gold' : 'bg-vivazza-red text-white'}`}>
            <Building2 size={28} />
            <div className={`absolute -bottom-6 text-[9px] font-black uppercase tracking-tighter ${activeSection === 'wholesale' ? 'text-vivazza-stone' : 'text-gray-400'}`}>Distribución</div>
          </button>

          <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-all duration-300 ${activeSection === 'game' ? 'text-vivazza-red translate-y-[-4px]' : 'text-gray-400'}`}>
            <Gamepad2 size={22} strokeWidth={activeSection === 'game' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Jugar</span>
          </button>
          <button onClick={() => { hapticFeedback(); setIsCartOpen(true); }} className={`flex flex-col items-center gap-1 px-3 py-1 text-gray-400 relative`}>
            <div className="relative">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-vivazza-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-cart-pop">{cartItems.length}</span>}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Pedido</span>
          </button>
        </div>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={addExtraToCart} showToast={addToast} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
    </div>
  );
}

export default App;
