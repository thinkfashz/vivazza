
"use client";

import React, { useState, useEffect, useTransition, useCallback, lazy, Suspense } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_CATALOG_URL } from '../constants';
import { Pizza, CartItem, ToastMessage, Coupon } from '../types';
import PizzaCard from '../components/PizzaCard';
import PizzaModal from '../components/PizzaModal';
import CartSidebar from '../components/CartSidebar';
import NotFound from '../components/NotFound';
import TurboLoader from '../components/TurboLoader';
import { ToastContainer } from '../components/Toast';
import { ShoppingBag, Gamepad2, Home, Instagram, MessageCircle, Building2, List, ChevronRight, Zap, Sparkles, Award, Star, Heart } from 'lucide-react';

// Turbo Architecture: Lazy Loading Modules
const PizzaCatalog = lazy(() => import('../components/PizzaCatalog'));
const AboutUs = lazy(() => import('../components/AboutUs'));
const Wholesale = lazy(() => import('../components/Wholesale'));
const PizzaRush = lazy(() => import('../components/PizzaRush'));
const Testimonials = lazy(() => import('../components/Testimonials'));

type Section = 'menu' | 'catalog' | 'about' | 'wholesale' | 'game' | '404';

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
      try { setCartItems(JSON.parse(savedCart)); } catch (e) {}
    }
  }, []);

  const prefetch = useCallback((section: Section) => {
    switch(section) {
      case 'catalog': import('../components/PizzaCatalog'); break;
      case 'about': import('../components/AboutUs'); break;
      case 'wholesale': import('../components/Wholesale'); break;
      case 'game': import('../components/PizzaRush'); break;
    }
  }, []);

  const handleNavChange = useCallback((section: Section) => {
    startTransition(() => {
      setActiveSection(section);
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  const addToCart = useCallback((pizza: Pizza) => {
    setCartItems(prev => [...prev, {
      id: Date.now().toString(),
      pizzaName: pizza.name,
      basePrice: pizza.price,
      quantity: 1,
      isCustom: false
    }]);
    setToasts(prev => [...prev, { id: Date.now().toString(), message: `${pizza.name} agregada`, type: 'success' }]);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-grain flex flex-col pb-24 md:pb-0 select-none overflow-x-hidden">
      {/* Turbo Progress Bar */}
      <div 
        className={`fixed top-0 left-0 h-1 bg-vivazza-red z-[100] transition-all duration-700 ease-out ${isPending ? 'opacity-100' : 'opacity-0 w-0'}`} 
        style={{ width: isPending ? '85%' : '0%' }} 
      />
      
      <ToastContainer toasts={toasts} removeToast={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
      
      <nav className="hidden md:block sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
            <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
            <span className="ml-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">TALCA · ARTESANAL</span>
          </div>
          <div className="flex space-x-10">
            {[
              { id: 'menu', label: 'Inicio' },
              { id: 'catalog', label: 'Carta' },
              { id: 'about', label: 'Nosotros' },
              { id: 'wholesale', label: 'Distribución' },
              { id: 'game', label: 'Jugar' }
            ].map((sec) => (
              <button 
                key={sec.id} 
                onClick={() => handleNavChange(sec.id as Section)}
                onMouseEnter={() => prefetch(sec.id as Section)}
                className={`font-heading text-xl uppercase tracking-tight transition-all duration-200 ${activeSection === sec.id ? 'text-vivazza-red scale-105' : 'text-vivazza-stone hover:text-vivazza-red opacity-60'}`}
              >
                {sec.label}
              </button>
            ))}
          </div>
          <button onClick={() => setIsCartOpen(true)} className="relative bg-vivazza-red text-white p-3 rounded-2xl shadow-red active:scale-95 transition-all">
            <ShoppingBag size={24} />
            {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ring-2 ring-white">{cartItems.length}</span>}
          </button>
        </div>
      </nav>

      <main className={`flex-grow w-full max-w-7xl mx-auto md:px-0 py-0 md:py-8 transition-all ${activeSection === 'menu' ? 'md:py-0' : ''}`}>
        <Suspense fallback={<TurboLoader />}>
          {activeSection === 'menu' && (
            <div className="animate-turbo">
              <div className="relative min-h-[90vh] md:min-h-[85vh] w-full flex items-center justify-center overflow-hidden bg-vivazza-stone md:rounded-[3.5rem] shadow-premium">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://pmnwbbyfiqgkukshporq.supabase.co/storage/v1/object/sign/Mis%20recursos%20fabrick/Image_202601130236.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iNWM0NjUxNi1iNjY0LTQ0ZTAtOWY4My1iMDQyYzNmZDI3YTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJNaXMgcmVjdXJzb3MgZmFicmljay9JbWFnZV8yMDI2MDExMzAyMzYuanBlZyIsImlhdCI6MTc2ODI4MzE4NSwiZXhwIjoyMDgzNjQzMTg1fQ.KYNVnQRV4rla6uKJvsnZCAeZj7Lj8KL4EZeSr6GNq9U" 
                    className="w-full h-full object-cover opacity-60 animate-ken-burns" 
                    alt="Background Pizza Premium"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-vivazza-stone via-transparent to-vivazza-stone/50"></div>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>

                <div className="relative z-10 w-full max-w-5xl px-6 text-center space-y-12">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
                      <Sparkles size={14} className="text-vivazza-gold animate-pulse" />
                      72 Horas de Reposo Sagrado
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-heading text-[12vw] md:text-[8rem] text-white leading-[0.8] tracking-tighter uppercase text-shadow-premium">
                      EL ARTE DE UNA <br/>
                      <span className="text-vivazza-red filter brightness-110 drop-shadow-[0_0_30px_rgba(166,29,36,0.5)]">BUENA PIZZA</span>
                    </h2>
                    <p className="text-white/70 text-lg md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed tracking-tight italic">
                      Descubre el equilibrio perfecto entre textura, aroma <br className="hidden md:block"/> y el sabor de nuestra alquimia artesanal de 72 horas.
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <button 
                      onClick={() => handleNavChange('catalog')}
                      onMouseEnter={() => prefetch('catalog')}
                      className="btn-premium-red group w-full md:w-auto px-12 py-6 rounded-2xl text-white font-heading text-3xl md:text-4xl shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                    >
                      <Zap size={28} className="fill-current" />
                      HACER PEDIDO
                    </button>
                    <button 
                      onClick={() => handleNavChange('about')}
                      onMouseEnter={() => prefetch('about')}
                      className="btn-glass-modern w-full md:w-auto px-12 py-6 rounded-2xl text-white font-heading text-3xl md:text-4xl flex items-center justify-center gap-4 active:scale-95"
                    >
                      <Heart size={28} className="text-vivazza-red" />
                      NUESTRA HISTORIA
                    </button>
                  </div>
                </div>
              </div>

              <section className="py-28 px-6 max-w-7xl mx-auto relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12 relative z-10">
                  <div className="space-y-8 max-w-3xl">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-vivazza-stone text-white rounded-full shadow-xl">
                      <Award size={18} className="text-vivazza-gold" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">TOP VENTAS · GARANTÍA VIVAZZA</p>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse ml-2"></div>
                    </div>

                    <h3 className="font-heading text-7xl md:text-[9rem] text-vivazza-stone uppercase leading-[0.85] tracking-tighter">
                      LAS MÁS <br/>
                      <span className="text-vivazza-red italic relative inline-block">
                        ACLAMADAS
                        <svg className="absolute -bottom-2 left-0 w-full h-4 text-vivazza-red/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                          <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="10" fill="transparent" strokeLinecap="round" />
                        </svg>
                      </span> DE TALCA
                    </h3>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-4">
                    <button 
                      onClick={() => handleNavChange('catalog')}
                      onMouseEnter={() => prefetch('catalog')}
                      className="group relative px-12 py-6 bg-white border-2 border-vivazza-stone rounded-2xl text-vivazza-stone font-heading text-2xl md:text-3xl uppercase tracking-tight hover:bg-vivazza-stone hover:text-white transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] active:scale-95 overflow-hidden"
                    >
                      <div className="relative z-10 flex items-center gap-4">
                        VER CARTA COMPLETA <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                  {PIZZAS.slice(0, 3).map((pizza, idx) => (
                    <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={idx} />
                  ))}
                </div>
              </section>

              {/* SECCIÓN DE TESTIMONIOS GOURMET */}
              <Testimonials />
            </div>
          )}

          {activeSection === 'catalog' && <div className="px-6"><PizzaCatalog onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} /></div>}
          {activeSection === 'about' && <div className="px-6"><AboutUs /></div>}
          {activeSection === 'wholesale' && <div className="px-6"><Wholesale /></div>}
          {activeSection === 'game' && <div className="px-6"><PizzaRush onWinCoupon={(c) => {setAppliedCoupon(c); setIsCartOpen(true);}} /></div>}
          {activeSection === '404' && <NotFound onBack={() => handleNavChange('menu')} />}
        </Suspense>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-3xl border-t border-gray-100 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.12)]">
        <div className="flex justify-around items-end px-2 py-4 pb-safe-bottom">
          <button 
            onClick={() => handleNavChange('menu')} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeSection === 'menu' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}
          >
            <Home size={22} strokeWidth={activeSection === 'menu' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">INICIO</span>
          </button>
          
          <button 
            onClick={() => handleNavChange('catalog')}
            onMouseEnter={() => prefetch('catalog')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeSection === 'catalog' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}
          >
            <List size={22} strokeWidth={activeSection === 'catalog' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">CARTA</span>
          </button>

          <button 
            onClick={() => handleNavChange('game')}
            onMouseEnter={() => prefetch('game')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeSection === 'game' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}
          >
            <Gamepad2 size={22} strokeWidth={activeSection === 'game' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">JUGAR</span>
          </button>
          
          <div className="flex flex-col items-center gap-1 relative -top-6">
            <button 
              onClick={() => handleNavChange('about')}
              onMouseEnter={() => prefetch('about')}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-xl border-4 border-white transition-all active:scale-90 ${activeSection === 'about' ? 'bg-vivazza-red text-white' : 'bg-vivazza-stone text-vivazza-gold'}`}
            >
              <Heart size={24} fill={activeSection === 'about' ? 'white' : 'none'} />
            </button>
            <span className={`mt-1 text-[8px] font-black uppercase tracking-tighter ${activeSection === 'about' ? 'text-vivazza-red' : 'text-gray-400 opacity-60'}`}>NOSOTROS</span>
          </div>

          <button 
            onClick={() => handleNavChange('wholesale')}
            onMouseEnter={() => prefetch('wholesale')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeSection === 'wholesale' ? 'text-vivazza-red scale-110' : 'text-gray-400 opacity-60'}`}
          >
            <Building2 size={22} strokeWidth={activeSection === 'wholesale' ? 2.5 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">MAYORISTA</span>
          </button>
          
          <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1.5 text-gray-400 opacity-60 relative transition-all active:scale-90">
            <div className="relative">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-vivazza-red text-white text-[7px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartItems.length}
                </span>
              )}
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter">PEDIDO</span>
          </button>
        </div>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={(extra) => addToCart({ ...PIZZAS[0], name: extra.name, price: extra.price, id: extra.id } as Pizza)} showToast={() => {}} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
    </div>
  );
}
