import React, { useState, useEffect, useRef } from 'react';
import { CartItem, DeliveryDetails, Coupon, ExtraItem } from '../types';
import { COUPONS, OPENING_HOUR, CLOSING_HOUR, EXTRAS } from '../constants';
import { formatCLP } from '../utils';
import { X, ShoppingBag, MapPin, Store, Trash2, Send, Tag, Locate, Check, ChevronDown, PlusCircle, ArrowLeft, Map, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import OrderSuccessModal from './OrderSuccessModal';
import ImageWithFallback from './ImageWithFallback';
import LocationMap from './LocationMap';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onAddExtra: (extra: ExtraItem) => void;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon) => void;
}

interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ 
  isOpen, 
  onClose, 
  cartItems, 
  onRemoveItem, 
  onAddExtra,
  showToast,
  appliedCoupon,
  onApplyCoupon
}) => {
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    method: 'delivery',
    address: '',
    instructions: ''
  });
  
  const [couponCode, setCouponCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showMap, setShowMap] = useState(false);
  
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const INITIAL_EXTRAS_COUNT = 4;
  const [visibleExtrasCount, setVisibleExtrasCount] = useState(INITIAL_EXTRAS_COUNT);
  const extrasCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (appliedCoupon) {
      setCouponCode(appliedCoupon.code);
    }
  }, [appliedCoupon]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setAddressSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (delivery.method !== 'delivery' || delivery.address.length < 5) {
      setAddressSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (addressSuggestions.some(s => s.display_name === delivery.address)) return;
      
      setIsSearchingAddress(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(delivery.address + ' Talca Chile')}&limit=5`
        );
        const data = await response.json();
        setAddressSuggestions(data);
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [delivery.address, delivery.method]);

  const validateAddress = (addr: string): boolean => {
    if (!addr.trim()) {
      setAddressError("La dirección es obligatoria.");
      return false;
    }
    if (!/\d/.test(addr)) {
      setAddressError("Incluye número de casa/depto.");
      return false;
    }
    setAddressError(null);
    return true;
  };

  const handleSelectSuggestion = (s: AddressSuggestion) => {
    const cleanAddress = s.display_name.split(',').slice(0, 2).join(', ');
    setDelivery(prev => ({
      ...prev,
      address: cleanAddress,
      coords: { lat: parseFloat(s.lat), lng: parseFloat(s.lon) }
    }));
    setAddressSuggestions([]);
    validateAddress(cleanAddress);
    showToast("Dirección verificada.", 'success');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  const deliveryFee = delivery.method === 'delivery' ? 2000 : 0;
  const discountAmount = appliedCoupon ? Math.round(total * (appliedCoupon.discountPercent / 100)) : 0;
  const finalTotal = total + deliveryFee - discountAmount;

  const isShopOpen = () => {
    const hour = new Date().getHours();
    return hour >= OPENING_HOUR && hour < CLOSING_HOUR;
  };
  const shopOpen = isShopOpen();

  const handleApplyCoupon = () => {
    const found = COUPONS.find(c => c.code === couponCode.toUpperCase());
    if (found) {
      onApplyCoupon(found);
      showToast(`¡Cupón aplicado!`, 'success');
    } else {
      showToast("Cupón inválido.", 'error');
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      showToast("GPS no soportado.", 'error');
      return;
    }
    showToast("Localizando...", 'info');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDelivery(prev => ({
          ...prev, 
          address: `Mi ubicación actual`,
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        }));
        setAddressError(null);
        showToast("Ubicación lista.", 'success');
      },
      () => showToast("Error al localizar.", 'error')
    );
  };

  const handleMapConfirm = (address: string, coords: { lat: number; lng: number }) => {
      setDelivery(prev => ({...prev, address, coords}));
      setAddressError(null);
      showToast("Mapa listo.", 'success');
  };

  const handleLoadMoreExtras = () => {
    setVisibleExtrasCount(prev => Math.min(prev + 4, EXTRAS.length));
    if (extrasCarouselRef.current) {
        setTimeout(() => {
            extrasCarouselRef.current?.scrollTo({
                left: extrasCarouselRef.current.scrollLeft + 180,
                behavior: 'smooth'
            });
        }, 100);
    }
  };

  const handleCheckout = () => {
    if (!shopOpen && !window.confirm("Local cerrado. ¿Enviar como Pre-Orden?")) return;
    if (delivery.method === 'delivery' && !validateAddress(delivery.address)) return;

    const itemsList = cartItems.map((item, idx) => 
      `${idx + 1}. ${item.pizzaName} (x${item.quantity})${item.isCustom ? ' [Custom]' : ''}`
    ).join('\n');

    const message = `*NUEVO PEDIDO VIVAZZA*\n${delivery.method === 'delivery' ? `📍 ${delivery.address}` : '🏪 RETIRO'}\n\n*Items:*\n${itemsList}\n\n*Total:* ${formatCLP(finalTotal)}`;
    window.open(`https://wa.me/56912345678?text=${encodeURIComponent(message)}`, '_blank');
    onClose(); 
    setTimeout(() => setShowSuccessModal(true), 500);
  };

  return (
    <>
      <OrderSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <LocationMap isOpen={showMap} onClose={() => setShowMap(false)} onConfirm={handleMapConfirm} initialCoords={delivery.coords} />

      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <div className={`fixed top-0 right-0 h-[100dvh] w-full md:max-w-md bg-vivazza-cream z-50 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header con Safe Area */}
        <div className="flex-none px-6 py-4 bg-vivazza-stone text-white flex justify-between items-center shadow-lg pt-[env(safe-area-inset-top,1rem)]">
          <div className="flex items-center gap-3">
            <div className="bg-vivazza-gold/20 p-2 rounded-lg">
              <ShoppingBag className="text-vivazza-gold" size={24} />
            </div>
            <div>
              <h2 className="font-heading text-2xl tracking-wide leading-none uppercase">Tu Bolsa</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{cartItems.length} Productos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 -mr-2 hover:bg-white/10 rounded-full transition-colors active:scale-90" aria-label="Cerrar">
            <ChevronDown size={28} className="md:hidden" />
            <X size={24} className="hidden md:block" />
          </button>
        </div>

        {/* Scrollable Content con bounce nativo */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain no-scrollbar pb-32">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-24 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <ShoppingBag size={40} />
              </div>
              <h3 className="font-heading text-2xl text-vivazza-stone">Bolsa Vacía</h3>
              <p className="text-sm text-gray-500 mt-2 mb-8">Nuestras pizzas artesanales te están esperando.</p>
              <button onClick={onClose} className="bg-vivazza-red text-white px-8 py-3 rounded-xl font-heading text-lg shadow-red active:scale-95 transition-transform">
                Ir a la Carta
              </button>
            </div>
          ) : (
            <>
              {/* Items con espaciado móvil optimizado */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group animate-fade-in-up">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-vivazza-stone text-base truncate">{item.pizzaName}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded font-bold uppercase">x{item.quantity}</span>
                        <span className="text-vivazza-red font-heading text-lg">{formatCLP(item.basePrice * item.quantity)}</span>
                      </div>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} className="p-3 text-gray-300 hover:text-red-500 transition-colors active:scale-90" aria-label="Eliminar">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Sugerencias de Up-selling */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl text-vivazza-stone">Acompaña tu Pizza</h3>
                  <span className="text-[10px] bg-vivazza-gold/10 text-vivazza-gold px-2 py-0.5 rounded font-bold uppercase tracking-wider">Top Picks</span>
                </div>
                
                <div ref={extrasCarouselRef} className="flex overflow-x-auto pb-2 gap-4 snap-x no-scrollbar scroll-smooth -mx-1">
                  {EXTRAS.slice(0, visibleExtrasCount).map(extra => (
                    <div key={extra.id} className="snap-start flex-none w-40 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:scale-[1.05] active:scale-95 transition-all duration-300 animate-fade-in-up" onClick={() => onAddExtra(extra)}>
                      <div className="h-28 relative">
                         <ImageWithFallback src={extra.image} alt={extra.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/5"></div>
                         <div className="absolute bottom-2 right-2 bg-vivazza-red text-white p-1.5 rounded-full shadow-lg">
                           <PlusCircle size={18} />
                         </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-bold text-gray-800 leading-tight h-8 line-clamp-2">{extra.name}</p>
                        <p className="text-xs text-vivazza-red font-bold mt-1.5">{formatCLP(extra.price)}</p>
                      </div>
                    </div>
                  ))}
                  
                  {visibleExtrasCount < EXTRAS.length && (
                    <button onClick={handleLoadMoreExtras} className="snap-start flex-none w-24 h-[180px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 active:text-vivazza-red active:border-vivazza-red transition-all group">
                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm group-active:bg-vivazza-red group-active:text-white transition-colors">
                            <ChevronRight size={24} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Ver más</span>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {cartItems.length > 0 && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h3 className="font-heading text-2xl text-vivazza-stone flex items-center gap-3">
                <MapPin size={22} className="text-vivazza-red"/> Información de Entrega
              </h3>
              
              <div className="flex bg-gray-100 p-1.5 rounded-xl">
                <button 
                  onClick={() => setDelivery(prev => ({ ...prev, method: 'delivery' }))}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${delivery.method === 'delivery' ? 'bg-white text-vivazza-stone shadow-md' : 'text-gray-400'}`}
                >
                  Dilivery
                </button>
                <button 
                  onClick={() => setDelivery(prev => ({ ...prev, method: 'pickup' }))}
                  className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${delivery.method === 'pickup' ? 'bg-white text-vivazza-stone shadow-md' : 'text-gray-400'}`}
                >
                  Retiro
                </button>
              </div>

              {delivery.method === 'delivery' && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="Calle y Número (Ej: 2 Norte 1234)"
                      className={`w-full p-4 pr-32 border ${addressError ? 'border-red-500' : 'border-gray-200'} rounded-2xl text-base focus:ring-2 focus:ring-vivazza-red focus:border-transparent bg-gray-50 focus:bg-white transition-all`}
                      value={delivery.address}
                      onChange={(e) => {
                        setDelivery(prev => ({...prev, address: e.target.value}));
                        setAddressError(null);
                      }}
                    />
                    
                    <div className="absolute right-2 top-2 flex gap-1.5">
                        {isSearchingAddress && <Loader2 size={18} className="text-vivazza-red animate-spin mt-2.5 mr-1" />}
                        <button onClick={handleGeolocation} className="p-2.5 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100 active:bg-vivazza-red active:text-white transition-colors">
                          <Locate size={22} />
                        </button>
                        <button onClick={() => setShowMap(true)} className="p-2.5 text-white bg-vivazza-stone rounded-xl shadow-sm active:scale-95">
                          <Map size={22} />
                        </button>
                    </div>

                    {addressSuggestions.length > 0 && (
                      <div ref={suggestionRef} className="absolute left-0 right-0 bottom-full mb-3 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] overflow-hidden animate-fade-in-up">
                        <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sugerencias en Talca</div>
                        {addressSuggestions.map((s, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectSuggestion(s)}
                            className="w-full text-left px-4 py-4 hover:bg-gray-50 flex items-start gap-4 border-b border-gray-50 last:border-0 transition-colors active:bg-red-50"
                          >
                            <MapPin size={18} className="text-gray-300 mt-0.5" />
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-vivazza-stone truncate">{s.display_name.split(',')[0]}</p>
                                <p className="text-[10px] text-gray-400 truncate">{s.display_name.split(',').slice(1, 4).join(', ')}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {addressError && (
                    <div className="flex items-center gap-2 text-red-500 text-[11px] font-bold px-1 animate-pulse">
                      <AlertCircle size={14} /> {addressError}
                    </div>
                  )}

                  <input 
                    type="text"
                    placeholder="Instrucciones (Block, Depto, Casa)"
                    className="w-full p-4 border border-gray-200 rounded-2xl text-base focus:ring-2 focus:ring-vivazza-red bg-gray-50 focus:bg-white"
                    value={delivery.instructions}
                    onChange={(e) => setDelivery(prev => ({...prev, instructions: e.target.value}))}
                  />
                </div>
              )}

              <div className="pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={18} className="absolute left-4 top-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="CÓDIGO CUPÓN"
                      className="w-full pl-11 p-4 border border-gray-200 rounded-2xl text-sm uppercase font-bold tracking-widest focus:ring-2 focus:ring-vivazza-red"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                  </div>
                  <button onClick={handleApplyCoupon} className="bg-vivazza-stone text-white px-6 rounded-2xl text-xs font-bold active:scale-95 tracking-widest uppercase">
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer flotante optimizado para Safe Areas */}
        {cartItems.length > 0 && (
          <div className="flex-none p-6 bg-white border-t border-gray-100 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] z-20 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Final</p>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-4xl text-vivazza-red leading-none">{formatCLP(finalTotal)}</span>
                  {appliedCoupon && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded font-bold">-{appliedCoupon.discountPercent}%</span>}
                </div>
              </div>
              <button onClick={onClose} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-vivazza-stone border-b border-gray-200 p-1 mb-1">
                Seguir Comprando
              </button>
            </div>
            
            <button 
              onClick={handleCheckout}
              className={`w-full text-white py-4.5 rounded-2xl font-heading text-2xl shadow-xl transition-all flex items-center justify-center gap-4 active:scale-[0.97] ${shopOpen ? 'bg-gradient-to-r from-[#25D366] to-[#1da851] shadow-green-200' : 'bg-vivazza-stone shadow-gray-200'}`}
            >
              {shopOpen ? <Send size={24} /> : <Loader2 size={24} className="animate-spin" />}
              {shopOpen ? 'COMPLETAR PEDIDO' : 'PRE-ORDENAR'}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;