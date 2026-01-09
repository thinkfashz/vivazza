
"use client";

import React, { useState, useEffect, useMemo, useTransition, useCallback } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_PHONE, VIVAZZA_CATALOG_URL, VIVAZZA_LOCATION } from '../constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from '../types';
import PizzaCard from '../components/PizzaCard';
import PizzaModal from '../components/PizzaModal';
import PizzaRush from '../components/PizzaRush';
import Wholesale from '../components/Wholesale';
import PizzaCatalog from '../components/PizzaCatalog';
import CartSidebar from '../components/CartSidebar';
import NotFound from '../components/NotFound';
import { ToastContainer } from '../components/Toast';
import { ShoppingBag, Gamepad2, Home, Instagram, MessageCircle, Building2, MapPin, Phone, ExternalLink, List, ChevronRight, Zap, Flame } from 'lucide-react';

type Section = 'menu' | 'catalog' | 'wholesale' | 'game' | '404';

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

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('menu');
  const [isPending, startTransition] = useTransition();
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
      } catch (e) {}
    }
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
      {isPending && <div className="turbo-bar" style={{ width: '40%' }} />}
      
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      
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
                {sec === 'wholesale' ? 'Distribución' : sec === 'game' ? 'Jugar' : sec === 'catalog' ? 'Carta' : 'Inicio'}
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

      <main className={`flex-grow max-w-7xl mx-auto w-full px-2 md:px-6 py-2 md:py-8 transition-opacity duration-200 ${isPending ? 'opacity-50' : 'opacity-100'}`}>
        <div className="animate-turbo gpu-accel">
          {activeSection === 'menu' && (
            <div className="space-y-12">
              {/* Flyer Principal Premium */}
              <div className="relative rounded-[2.8rem] md:rounded-[4rem] overflow-hidden bg-vivazza-stone h-[85vh] md:h-[80vh] flex flex-col items-center justify-center p-6 md:p-20 shadow-premium group text-center mb-8">
                {/* Overlay gradiente radial para enfoque central */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.85)_100%)] z-10"></div>
                
                <div className="relative z-20 w-full max-w-2xl flex flex-col h-full justify-between py-10">
                  <div className="flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-vivazza-red text-white text-[11px] font-black rounded-full mb-10 uppercase tracking-[0.3em] shadow-xl animate-fade-in-up">
                      ARTESANAL & PREMIUM
                    </div>
                    
                    <h2 className="font-heading text-[18vw] md:text-[10rem] mb-2 leading-[0.8] text-white tracking-tighter uppercase drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                      EL ARTE DE UNA <br/>
                      <span className="text-vivazza-red inline-block transform -rotate-1 md:-rotate-2">BUENA PIZZA</span>
                    </h2>
                    
                    <div className="w-16 h-1 bg-vivazza-red/50 my-8 rounded-full"></div>
                    
                    <p className="text-white text-xl md:text-2xl font-medium opacity-90 leading-relaxed px-8 max-w-lg mx-auto drop-shadow-md italic">
                      "El equilibrio perfecto entre textura, aroma y sabor."
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
                    <button 
                      onClick={() => handleNavChange('catalog')} 
                      className="group relative overflow-hidden bg-vivazza-red text-white w-full py-5 rounded-[1.5rem] font-heading text-3xl shadow-[0_20px_40px_-10px_rgba(166,29,36,0.5)] active:scale-95 transition-all"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                      VER CATÁLOGO
                    </button>
                    <button 
                      onClick={() => window.open(VIVAZZA_CATALOG_URL, '_blank')} 
                      className="bg-white/10 backdrop-blur-2xl text-white border border-white/20 w-full py-5 rounded-[1.5rem] font-heading text-3xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-2xl hover:bg-white/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                        <MessageCircle size={24} className="text-green-400 fill-current/20" />
                      </div>
                      PEDIR POR WHATSAPP
                    </button>
                  </div>
                </div>
                
                {/* Imagen de fondo con efecto Ken Burns */}
                <img 
                  src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80" 
                  className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[15000ms] ease-linear" 
                  alt="Vivazza Hero" 
                  loading="eager" 
                />
                
                {/* Textura de grano fina específica para el hero */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")' }}></div>
              </div>

              <section className="section-visible px-4">
                <div className="flex justify-between items-end mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-vivazza-red uppercase tracking-[0.4em] ml-1">Favoritos de la casa</p>
                    <h3 className="font-heading text-6xl text-vivazza-stone uppercase leading-none tracking-tighter">LO <span className="text-vivazza-red">MÁS PEDIDO</span></h3>
                  </div>
                  <button onClick={() => handleNavChange('catalog')} className="text-[10px] font-black uppercase text-vivazza-red tracking-widest flex items-center gap-2 mb-2 group">
                    VER CARTA <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Barra Móvil Estilizada */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] gpu-accel">
        <div className="flex justify-around items-end px-3 py-4 pb-safe-bottom relative">
          <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1.5 px-4 transition-all duration-300 ${activeSection === 'menu' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}>
            <Home size={26} strokeWidth={activeSection === 'menu' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">INICIO</span>
          </button>
          
          <button onClick={() => handleNavChange('catalog')} className={`flex flex-col items-center gap-1.5 px-4 transition-all duration-300 ${activeSection === 'catalog' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}>
            <List size={26} strokeWidth={activeSection === 'catalog' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">CARTA</span>
          </button>
          
          <div className="flex flex-col items-center gap-1 relative -top-6">
            <button 
              onClick={() => handleNavChange('wholesale')} 
              className={`flex items-center justify-center w-20 h-20 rounded-full shadow-[0_15px_30px_-5px_rgba(166,29,36,0.4)] transition-all active:scale-90 bg-vivazza-red text-white mb-1 border-[6px] border-white`}
            >
              <Building2 size={32} />
            </button>
            <span className={`text-[10px] font-black uppercase tracking-tighter ${activeSection === 'wholesale' ? 'text-vivazza-red' : 'text-gray-400 opacity-60'}`}>DISTRIBUCIÓN</span>
          </div>

          <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1.5 px-4 transition-all duration-300 ${activeSection === 'game' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}>
            <Gamepad2 size={26} strokeWidth={activeSection === 'game' ? 2.5 : 2} />
            <span className="text-[10px] font-black uppercase tracking-tighter">JUGAR</span>
          </button>
          
          <button onClick={() => { hapticFeedback(); setIsCartOpen(true); }} className={`flex flex-col items-center gap-1.5 px-4 text-gray-400 relative transition-all active:scale-90`}>
            <div className="relative">
              <ShoppingBag size={26} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-vivazza-red text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white animate-cart-pop">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter">PEDIDO</span>
          </button>
        </div>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={(extra) => addToCart({ ...PIZZAS[0], name: extra.name, price: extra.price, id: extra.id } as Pizza)} showToast={() => {}} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2.5s infinite linear;
        }
      ` }} />
    </div>
  );
}
