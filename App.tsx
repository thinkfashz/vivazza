
import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
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
import { ShoppingBag, Gamepad2, Pizza as PizzaIcon, Home, Instagram, MessageCircle, Building2, MapPin, Phone, ExternalLink, Star, Quote, Clock, Truck, List, ChevronRight, Zap, Flame } from 'lucide-react';

type Section = 'menu' | 'catalog' | 'wholesale' | 'game' | '404';

// Gestor de Audio Optimizado
class AudioManager {
  private static ctx: AudioContext | null = null;
  static getContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    return this.ctx;
  }
}

function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [isPending, startTransition] = useTransition(); // Turbo Navigation Hook
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [stockCount, setStockCount] = useState(12);

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('vivazza_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {}
    }
    
    const stockTimer = setInterval(() => {
      setStockCount(prev => (prev > 3 ? prev - 1 : prev));
    }, 45000);
    return () => clearInterval(stockTimer);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('vivazza_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  const hapticFeedback = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(5);
    }
  }, []);

  const playUISound = useCallback((freq = 880) => {
    try {
      const ctx = AudioManager.getContext();
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, []);

  const handleNavChange = useCallback((section: Section) => {
    hapticFeedback();
    playUISound(660);
    // Turbo transition: No bloquea el renderizado principal
    startTransition(() => {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [hapticFeedback, playUISound]);

  const addToCart = useCallback((pizza: Pizza) => {
    hapticFeedback();
    setCartItems(prev => [...prev, {
      id: Date.now().toString(),
      pizzaName: pizza.name,
      basePrice: pizza.price,
      quantity: 1,
      isCustom: false
    }]);
    
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message: `${pizza.name} agregada`, type: 'success' }]);
  }, [hapticFeedback]);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-grain flex flex-col pb-24 md:pb-0 select-none overflow-x-hidden">
      {/* Turbo Progress Bar */}
      {isPending && <div className="turbo-bar" style={{ width: '40%' }} />}
      
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      
      {/* Desktop Navbar */}
      <nav className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm gpu-accel">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
            <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
            <span className="ml-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">TALCA · ARTESANAL</span>
          </div>

          <div className="flex space-x-10">
            {['menu', 'catalog', 'wholesale', 'game'].map((sec) => (
              <button 
                key={sec} 
                onClick={() => handleNavChange(sec as Section)} 
                className={`font-heading text-xl uppercase tracking-tight transition-all duration-200 ${activeSection === sec ? 'text-vivazza-red scale-105' : 'text-vivazza-stone hover:text-vivazza-red opacity-60'}`}
              >
                {sec === 'wholesale' ? 'B2B' : sec === 'game' ? 'Jugar' : sec === 'catalog' ? 'Carta' : 'Inicio'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => window.open(`https://instagram.com/${VIVAZZA_INSTAGRAM}`, '_blank')} className="text-vivazza-stone hover:text-vivazza-red transition-all hover:scale-110"><Instagram size={22} /></button>
            <button onClick={() => { playUISound(880); setIsCartOpen(true); hapticFeedback(); }} className="relative bg-vivazza-red text-white p-3 rounded-2xl shadow-red active:scale-95 transition-all">
              <ShoppingBag size={24} />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ring-2 ring-white animate-cart-pop">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      <main className={`flex-grow max-w-7xl mx-auto w-full px-4 md:px-6 py-4 md:py-8 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="animate-turbo gpu-accel">
          {activeSection === 'menu' && (
            <div className="space-y-12">
              <div className="relative rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden bg-vivazza-stone h-[50vh] md:h-[65vh] flex items-center p-6 md:p-20 shadow-premium group">
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10"></div>
                <div className="relative z-20 max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-vivazza-red text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
                      QUEDAN {stockCount} MASAS HOY
                    </span>
                  </div>
                  <h2 className="font-heading text-6xl md:text-8xl mb-4 leading-none text-white tracking-tighter uppercase">EL ARTE DE UNA <br/><span className="text-vivazza-red">BUENA PIZZA</span></h2>
                  <p className="font-medium text-gray-300 text-lg mb-8 max-w-md">El equilibrio perfecto entre textura, aroma y sabor artesanal.</p>
                  <div className="flex flex-wrap gap-4">
                    <button onClick={() => handleNavChange('catalog')} className="bg-vivazza-red text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-heading text-xl md:text-2xl shadow-red active:scale-95 transition-all flex items-center gap-3">
                      HACER MI PEDIDO
                    </button>
                    <button onClick={() => window.open(VIVAZZA_CATALOG_URL, '_blank')} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-heading text-2xl flex items-center gap-3 active:scale-95 duration-200">
                      <MessageCircle size={24} /> CATÁLOGO DIRECTO
                    </button>
                  </div>
                </div>
                <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="Vivazza Hero" loading="eager" />
              </div>

              <section className="section-visible">
                <h3 className="font-heading text-4xl text-vivazza-stone uppercase mb-8">Nuestros Favoritos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {PIZZAS.slice(0, 3).map((pizza, idx) => (
                    <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={idx} />
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeSection === 'catalog' && <PizzaCatalog onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} />}
          {activeSection === 'wholesale' && <Wholesale />}
          {activeSection === 'game' && <PizzaRush onWinCoupon={(c) => {setAppliedCoupon(c); setIsCartOpen(true);}} />}
          {activeSection === '404' && <NotFound onBack={() => handleNavChange('menu')} />}
        </div>
      </main>

      {/* Mobile Navbar with Hardware Acceleration */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-2xl border-t border-gray-100 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] gpu-accel">
        <div className="flex justify-around items-center px-2 py-3 pb-safe-bottom">
          <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-transform duration-200 ${activeSection === 'menu' ? 'text-vivazza-red scale-110' : 'text-gray-400'}`}>
            <Home size={22} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Inicio</span>
          </button>
          <button onClick={() => handleNavChange('catalog')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-transform duration-200 ${activeSection === 'catalog' ? 'text-vivazza-red scale-110' : 'text-gray-400'}`}>
            <List size={22} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Carta</span>
          </button>
          
          <button onClick={() => handleNavChange('wholesale')} className={`relative -mt-10 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-transform active:scale-90 ${activeSection === 'wholesale' ? 'bg-vivazza-stone text-vivazza-gold' : 'bg-vivazza-red text-white'}`}>
            <Building2 size={28} />
          </button>

          <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 px-3 py-1 transition-transform duration-200 ${activeSection === 'game' ? 'text-vivazza-red scale-110' : 'text-gray-400'}`}>
            <Gamepad2 size={22} />
            <span className="text-[9px] font-black uppercase tracking-tighter">Jugar</span>
          </button>
          <button onClick={() => { hapticFeedback(); setIsCartOpen(true); }} className={`flex flex-col items-center gap-1 px-3 py-1 text-gray-400 relative`}>
            <div className="relative">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && <span className="absolute -top-1.5 -right-1.5 bg-vivazza-red text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-full">{cartItems.length}</span>}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter">Pedido</span>
          </button>
        </div>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={(extra) => addToCart({ ...PIZZAS[0], name: extra.name, price: extra.price, id: extra.id } as Pizza)} showToast={() => {}} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
    </div>
  );
}

export default App;
