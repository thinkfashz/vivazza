
import React, { useState, useEffect, useMemo } from 'react';
import { PIZZAS, VIVAZZA_INSTAGRAM, VIVAZZA_PHONE, VIVAZZA_CATALOG_URL, VIVAZZA_LOCATION, REVIEWS } from './constants';
import { Pizza, CartItem, ToastMessage, ToastType, Coupon, ExtraItem } from './types';
import PizzaCard from './components/PizzaCard';
import PizzaModal from './components/PizzaModal';
import PizzaLab from './components/PizzaLab';
import PizzaRush from './components/PizzaRush';
import Wholesale from './components/Wholesale';
import PizzaCatalog from './components/PizzaCatalog';
import CartSidebar from './components/CartSidebar';
import NotFound from './components/NotFound';
import { ToastContainer } from './components/Toast';
import { ShoppingBag, Gamepad2, Pizza as PizzaIcon, Home, Instagram, MessageCircle, Building2, MapPin, Phone, ExternalLink, Star, Quote, Clock, Truck, List } from 'lucide-react';

type Section = 'menu' | 'catalog' | 'lab' | 'game' | 'wholesale' | '404';

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
      
      {/* Navbar Minimalista */}
      <nav className="hidden md:block sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavChange('menu')}>
            <h1 className="font-heading text-4xl text-vivazza-red tracking-tight">VIVAZZA</h1>
            <span className="ml-3 text-[9px] font-black text-gray-400 uppercase tracking-widest border-l pl-3 border-gray-200">TALCA // MASA MADRE</span>
          </div>

          <div className="flex space-x-10">
            {['menu', 'catalog', 'lab', 'game', 'wholesale'].map((sec) => (
              <button key={sec} onClick={() => handleNavChange(sec as Section)} className={`font-heading text-xl uppercase tracking-tight transition-colors ${activeSection === sec ? 'text-vivazza-red underline decoration-2 underline-offset-8' : 'text-vivazza-stone hover:text-vivazza-red'}`}>
                {sec === 'wholesale' ? 'B2B' : sec === 'game' ? 'Jugar' : sec === 'lab' ? 'Lab' : sec === 'catalog' ? 'Catálogo' : 'Inicio'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => handleSocialClick(`https://instagram.com/${VIVAZZA_INSTAGRAM}`)} className="text-vivazza-stone hover:text-vivazza-red transition-all hover:scale-110"><Instagram size={24} /></button>
            <button onClick={() => { playUISound(880); setIsCartOpen(true); }} className="relative bg-vivazza-red text-white p-3 rounded-2xl shadow-red hover:scale-105 active:scale-95 transition-all">
              <ShoppingBag size={24} />
              {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ring-2 ring-white animate-cart-pop">{cartItems.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-8">
        {activeSection === 'menu' && (
          <div className="space-y-24 animate-fade-in-up">
            {/* Hero Minimalista */}
            <div className="relative rounded-[3.5rem] overflow-hidden bg-vivazza-stone h-[70vh] flex items-center p-8 md:p-20 shadow-premium">
              <div className="relative z-20 max-w-3xl">
                <span className="inline-block px-4 py-1.5 bg-vivazza-red text-white text-[10px] font-black rounded-full mb-6 uppercase tracking-widest">Artesanal & Premium</span>
                <h2 className="font-heading text-7xl md:text-9xl mb-6 leading-none text-white tracking-tighter uppercase">EL SABOR DE <br/><span className="text-vivazza-red">LA PACIENCIA</span></h2>
                <p className="text-gray-300 text-xl font-medium mb-12 max-w-lg leading-relaxed">Fermentamos nuestra masa por 48 horas para lograr una ligereza y crunch inigualables.</p>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => handleNavChange('catalog')} className="bg-vivazza-red text-white px-12 py-5 rounded-2xl font-heading text-2xl shadow-red active:scale-95 transition-all">VER CATÁLOGO</button>
                  <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="bg-green-600 text-white px-12 py-5 rounded-2xl font-heading text-2xl flex items-center gap-3 active:scale-95 transition-all">
                    <MessageCircle size={24} /> CATÁLOGO WA
                  </button>
                </div>
              </div>
              <img src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1950&q=80" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Hero Vivazza" />
            </div>

            {/* Carta Rápida */}
            <section id="carta">
              <div className="flex justify-between items-end mb-12">
                <h3 className="font-heading text-5xl text-vivazza-stone uppercase leading-none">Pizzas <span className="text-vivazza-red">Destacadas</span></h3>
                <button 
                  onClick={() => handleNavChange('catalog')}
                  className="text-vivazza-red font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline"
                >
                  Ver todo el catálogo <ExternalLink size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {specialPizzas.concat(traditionalPizzas).slice(0, 3).map((pizza, idx) => (
                  <PizzaCard key={pizza.id} pizza={pizza} onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} index={idx} />
                ))}
              </div>
            </section>

            {/* Testimonios */}
            <section className="bg-white rounded-[4rem] p-12 md:p-24 shadow-xl border border-gray-50">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center gap-1 text-vivazza-gold mb-4">
                     {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                  </div>
                  <h3 className="font-heading text-6xl text-vivazza-stone uppercase leading-none">LO QUE DICEN <span className="text-vivazza-red">NUESTROS CLIENTES</span></h3>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {REVIEWS.slice(0, 3).map((rev) => (
                    <div key={rev.id} className="bg-vivazza-cream p-10 rounded-[2.5rem] relative group hover:-translate-y-2 transition-transform shadow-sm">
                       <Quote className="absolute top-8 right-8 text-vivazza-gold/20" size={48} />
                       <p className="text-lg font-medium italic text-vivazza-stone leading-relaxed mb-6">"{rev.text}"</p>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-vivazza-red rounded-full flex items-center justify-center text-white font-black">{rev.name[0]}</div>
                          <div>
                             <p className="font-bold text-vivazza-stone">{rev.name}</p>
                             <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{rev.date}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Cobertura y Horarios */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <div className="space-y-8">
                  <h3 className="font-heading text-6xl text-vivazza-stone uppercase tracking-tighter">COBERTURA <br/><span className="text-vivazza-red">& HORARIOS</span></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <Clock className="text-vivazza-red mb-4" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Horario de Atención</p>
                        <p className="font-bold text-xl text-vivazza-stone">{VIVAZZA_LOCATION.hours}</p>
                     </div>
                     <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                        <Truck className="text-vivazza-red mb-4" size={32} />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Zonas de Entrega</p>
                        <ul className="text-sm font-bold text-vivazza-stone space-y-1">
                           {VIVAZZA_LOCATION.zones.map((z, i) => <li key={i}>• {z}</li>)}
                        </ul>
                     </div>
                  </div>
                  <button onClick={() => handleSocialClick(VIVAZZA_CATALOG_URL)} className="bg-green-600 text-white px-10 py-5 rounded-2xl font-heading text-2xl flex items-center gap-3 active:scale-95 transition-all shadow-lg">
                     CONSULTAR POR WHATSAPP <MessageCircle size={24} />
                  </button>
               </div>
               <div className="bg-vivazza-red rounded-[4rem] p-12 md:p-20 text-white shadow-premium relative overflow-hidden group">
                  <div className="relative z-10">
                     <h4 className="font-heading text-5xl mb-6 uppercase leading-none">PIDE HOY MISMO</h4>
                     <p className="text-white/80 font-medium text-lg mb-10">¿Listo para probar la mejor pizza artesanal de la región del Maule?</p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4"><MapPin className="text-vivazza-gold" /> <span>{VIVAZZA_LOCATION.address}</span></div>
                        <div className="flex items-center gap-4"><Phone className="text-vivazza-gold" /> <span>+{VIVAZZA_PHONE}</span></div>
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
               </div>
            </section>
          </div>
        )}

        {activeSection === 'catalog' && <PizzaCatalog onAdd={addToCart} onViewDetails={(p) => {setSelectedPizza(p); setIsModalOpen(true);}} />}
        {activeSection === 'lab' && <PizzaLab onAddToCart={addCustomToCart} showToast={addToast} />}
        {activeSection === 'game' && <PizzaRush onWinCoupon={(c) => {setAppliedCoupon(c); addToast("¡Descuento ganado!", "success"); setIsCartOpen(true);}} />}
        {activeSection === 'wholesale' && <Wholesale />}
        {activeSection === '404' && <NotFound onBack={() => handleNavChange('menu')} />}
      </main>

      {/* Nav Mobile Mejorado */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 px-6 py-3 z-40 flex justify-between items-center shadow-lg pb-safe-bottom">
        <button onClick={() => handleNavChange('menu')} className={`flex flex-col items-center gap-1 ${activeSection === 'menu' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Home size={22} />
          <span className="text-[9px] font-black uppercase">Inicio</span>
        </button>
        <button onClick={() => handleNavChange('catalog')} className={`flex flex-col items-center gap-1 ${activeSection === 'catalog' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <List size={22} />
          <span className="text-[9px] font-black uppercase">Catálogo</span>
        </button>
        <button onClick={() => handleNavChange('lab')} className={`flex flex-col items-center gap-1 ${activeSection === 'lab' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <PizzaIcon size={22} />
          <span className="text-[9px] font-black uppercase">Lab</span>
        </button>
        <button onClick={() => { playUISound(880); setIsCartOpen(true); }} className="relative bg-vivazza-red text-white p-3 rounded-2xl -mt-8 shadow-red ring-4 ring-white active:scale-90 transition-all">
          <ShoppingBag size={24} />
          {cartItems.length > 0 && <span className="absolute -top-2 -right-2 bg-vivazza-stone text-white text-[9px] font-bold w-5 h-5 flex items-center justify-center rounded-full ring-2 ring-white">{cartItems.length}</span>}
        </button>
        <button onClick={() => handleNavChange('game')} className={`flex flex-col items-center gap-1 ${activeSection === 'game' ? 'text-vivazza-red' : 'text-gray-400'}`}>
          <Gamepad2 size={22} />
          <span className="text-[9px] font-black uppercase">Gamer</span>
        </button>
      </div>

      <PizzaModal pizza={selectedPizza} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addToCart} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} onRemoveItem={removeFromCart} onAddExtra={addExtraToCart} showToast={addToast} appliedCoupon={appliedCoupon} onApplyCoupon={setAppliedCoupon} />
    </div>
  );
}

export default App;
