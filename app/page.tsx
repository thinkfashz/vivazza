
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_CATALOG_URL, VIVAZZA_LOCATION, VIVAZZA_PHONE } from '../constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from '../types';
import PizzaCard from '../components/PizzaCard';
import PizzaModal from '../components/PizzaModal';
import PizzaLab from '../components/PizzaLab';
import PizzaRush from '../components/PizzaRush';
import Wholesale from '../components/Wholesale';
import CartSidebar from '../components/CartSidebar';
import NotFound from '../components/NotFound';
import LocationMap from '../components/LocationMap';
import { ToastContainer } from '../components/Toast';
import { ShoppingBag, UtensilsCrossed, Gamepad2, Pizza as PizzaIcon, Home, Instagram, MessageCircle, Building2, MapPin, Phone, ExternalLink, Flame, Users } from 'lucide-react';

type Section = 'menu' | 'lab' | 'game' | 'wholesale' | '404';

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [selectedPizza, setSelectedPizza] = useState<Pizza | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [stockCount, setStockCount] = useState(12); // FOMO State

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

    // Nivel 1: Simulación de escasez (FOMO)
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

  if (!mounted) return null;

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
    playUISound(660);
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocialClick = (url: string) => {
    playUISound(1000);
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    window.open(url, '_blank');
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
      
      {/* Ticker Nivel 1: Social Proof */}
      <div className="bg-vivazza-stone text-white py-2 overflow-hidden whitespace-nowrap hidden md:block border-b border-white/10">
        <div className="animate-marquee inline-block">
          <span className="mx-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 inline-flex">
            <Users size={12} className="text-vivazza-red" /> +15 pedidos saliendo hoy en Talca
          </span>
          <span className="mx-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 inline-flex">
            <Flame size={12} className="text-vivazza-gold" /> Masa madre fermentada 48 horas
          </span>
          <span className="mx-4 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 inline-flex">
            <Users size={12} className="text-vivazza-red" /> Rodrigo acaba de pedir una Margarita
          </span>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-30 bg-vivazza-cream/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
              <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
              <span className="ml-3 text-[10px] tracking-[0.2em] text-gray-400 uppercase border-l pl-3 border-gray-300">
                Talca · Artesanal
              </span>
            </div>

            <div className="flex space-x-6">
              <button onClick={() => handleNavChange('menu')} className={`font-heading text-lg transition-colors ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>CARTA</button>
              <button onClick={() => handleNavChange('lab')} className={`font-heading text-lg transition-colors ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA LAB</button>
              <button onClick={() => handleNavChange('game')} className={`font-heading text-lg transition-colors ${activeSection === 'game' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>PIZZA BREAKER</button>
              <button onClick={() => handleNavChange('wholesale')} className={`font-heading text-lg transition-colors ${activeSection === 'wholesale' ? 'text-vivazza-red' : 'text-vivazza-stone hover:text-vivazza-red'}`}>B2B MAYORISTAS</button>
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => handleSocialClick(`https://instagram.com/${VIVAZZA_INSTAGRAM}`)} className="text-vivazza-stone hover:text-vivazza-red p-2 transition-colors"><Instagram size={22} /></button>
              <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="text-vivazza-stone hover:text-green-600 p-2 transition-colors"><MessageCircle size={22} /></button>
              <button onClick={() => { playUISound(880); setIsCartOpen(true); }} className="relative p-2 text-vivazza-stone group">
                <ShoppingBag size={28} className="group-hover:scale-110 transition-transform" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-vivazza-red rounded-full ring-2 ring-white animate-cart-pop">
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
            <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="text-green-600 p-2"><MessageCircle size={24} /></button>
            <button onClick={() => handleSocialClick(`https://instagram.com/${VIVAZZA_INSTAGRAM}`)} className="text-vivazza-stone p-2"><Instagram size={24} /></button>
         </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        
        {activeSection === 'menu' && (
          <div className="space-y-12 animate-fade-in-up">
            {/* Hero Nivel 1: Urgencia (FOMO) */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-vivazza-stone text-white p-6 md:p-16 mb-8 shadow-premium group">
              <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10"></div>
              <div className="relative z-20 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-vivazza-red text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
                    QUEDAN {stockCount} MASAS HOY
                  </span>
                </div>
                <h2 className="font-heading text-6xl md:text-8xl mb-4 leading-none text-white tracking-tighter">EL ARTE DE LA <br/><span className="text-vivazza-red">MASA MADRE</span></h2>
                <p className="font-medium text-gray-300 text-lg mb-8 max-w-md">No es pizza industrial. Es fermentación lenta, ingredientes locales y pasión artesanal.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => { playUISound(880); window.scrollTo({top: 800, behavior: 'smooth'}); }} className="bg-vivazza-red text-white px-10 py-4 rounded-2xl font-heading text-2xl shadow-red flex items-center gap-3 active:scale-95 duration-200">
                    HACER MI PEDIDO
                  </button>
                  <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-heading text-2xl flex items-center gap-3 active:scale-95 duration-200">
                    <MessageCircle size={24} /> CATÁLOGO DIRECTO
                  </button>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1950&q=80" alt="Pizza artesanal" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
            </div>

            {/* Menu Grid */}
            <section id="carta">
              <h3 className="font-heading text-4xl text-vivazza-stone uppercase tracking-tight mb-8">Selección Artesanal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {specialPizzas.map((pizza, index) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={index} />
                ))}
                {traditionalPizzas.map((pizza, index) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={index + specialPizzas.length} />
                ))}
              </div>
            </section>

            {/* Nivel 3: Geolocalización y Confianza */}
            <section className="pt-12 border-t border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="bg-vivazza-cream p-8 md:p-12 rounded-[3rem] border border-vivazza-gold/20 shadow-sm animate-fade-in-up">
                   <h3 className="font-heading text-5xl text-vivazza-stone uppercase tracking-tighter mb-8">PUNTO DE <br/><span className="text-vivazza-red">RETIRO EN TALCA</span></h3>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4">
                         <div className="bg-vivazza-red text-white p-3 rounded-2xl"><MapPin size={24} /></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Dirección Física</p>
                            <p className="text-xl font-bold text-vivazza-stone">{VIVAZZA_LOCATION.address}</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4">
                         <div className="bg-green-600 text-white p-3 rounded-2xl"><Phone size={24} /></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Ventas WhatsApp</p>
                            <p className="text-xl font-bold text-vivazza-stone">+{VIVAZZA_PHONE}</p>
                         </div>
                      </div>
                   </div>
                   <div className="mt-10 flex flex-wrap gap-4">
                      <button onClick={() => handleSocialClick(`https://www.google.com/maps/search/?api=1&query=${VIVAZZA_LOCATION.lat},${VIVAZZA_LOCATION.lng}`)} className="bg-vivazza-stone text-white px-8 py-4 rounded-2xl font-heading text-xl flex items-center gap-3 shadow-xl">
                        CÓMO LLEGAR <ExternalLink size={20} />
                      </button>
                      <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="bg-green-600 text-white px-8 py-4 rounded-2xl font-heading text-xl flex items-center gap-3 shadow-xl">
                        WHATSAPP <MessageCircle size={20} />
                      </button>
                   </div>
                </div>
                <div className="h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl border-8 border-white group relative">
                    <LocationMap 
                      isOpen={true} 
                      onClose={() => {}} 
                      onConfirm={() => {}} 
                      initialCoords={{lat: VIVAZZA_LOCATION.lat, lng: VIVAZZA_LOCATION.lng}}
                      isStatic={true}
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                </div>
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-gray-200 px-6 py-2 pb-safe-bottom z-40 flex justify-between items-center shadow-lg">
        <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Home size={22} />
          <span className="text-[9px] font-black uppercase">Carta</span>
        </button>
        <button onClick={() => handleNavChange('lab')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <PizzaIcon size={22} />
          <span className="text-[9px] font-black uppercase">Lab</span>
        </button>
        <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'game' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Gamepad2 size={22} />
          <span className="text-[9px] font-black uppercase">Jugar</span>
        </button>
        <button onClick={() => handleNavChange('wholesale')} className={`flex flex-col items-center gap-1 p-2 ${activeSection === 'wholesale' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Building2 size={22} />
          <span className="text-[9px] font-black uppercase">B2B</span>
        </button>
        <button onClick={() => { playUISound(880); setIsCartOpen(true); }} className="flex flex-col items-center gap-1 p-2 relative text-gray-400">
           <div className="relative">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-vivazza-red text-[8px] font-bold text-white"> 
                  {cartItems.length} 
                </span>
              )}
           </div>
           <span className="text-[9px] font-black uppercase tracking-tighter">Pedido</span>
        </button>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={addExtraToCart} showToast={addToast} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}
