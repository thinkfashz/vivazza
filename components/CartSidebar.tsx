
"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem, ExtraItem, Coupon, DeliveryDetails, ToastType } from '../types';
import { EXTRAS, COUPONS } from '../constants';
import { formatCLP, generateWhatsAppLink } from '../utils';
import { X, ShoppingBag, Trash2, ChevronRight, ChevronLeft, Tag, Truck, MapPin, MessageCircle, CreditCard, Store, AlertCircle, Loader2 } from 'lucide-react';
import OrderSuccessModal from './OrderSuccessModal';
import LocationMap from './LocationMap';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onAddExtra: (extra: ExtraItem) => void;
  showToast: (msg: string, type: ToastType) => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

type CheckoutStep = 'cart' | 'delivery';

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
  const [step, setStep] = useState<CheckoutStep>('cart');
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    method: 'delivery',
    address: '',
    instructions: ''
  });
  
  // Estados para Autocompletado de Direcciones
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  // Fix: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to resolve "Cannot find namespace 'NodeJS'"
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [couponInput, setCouponInput] = useState('');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0), [cartItems]);
  const discount = useMemo(() => appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0, [subtotal, appliedCoupon]);
  const total = subtotal - discount;

  // Limpiar sugerencias al cerrar el sidebar
  useEffect(() => {
    if (!isOpen) {
      setShowSuggestions(false);
      setAddressError(null);
    }
  }, [isOpen]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    setIsSearchingAddress(true);
    try {
      // Usamos Photon (OSM) que es gratuito y no requiere API Key. 
      // Sesgamos la búsqueda a Chile para mejores resultados locales.
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=-35.4264&lon=-71.6554&location_bias_scale=0.5`);
      const data = await response.json();
      
      const suggestions = data.features.map((f: any) => ({
        label: [
          f.properties.name,
          f.properties.street,
          f.properties.housenumber,
          f.properties.city,
          f.properties.state
        ].filter(Boolean).join(', '),
        coords: {
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0]
        }
      }));
      
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions", error);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeliveryDetails(d => ({ ...d, address: value }));
    setAddressError(null);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    if (value.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => {
        fetchAddressSuggestions(value);
      }, 500);
    } else {
      setAddressSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion: any) => {
    setDeliveryDetails(prev => ({
      ...prev,
      address: suggestion.label,
      coords: suggestion.coords
    }));
    setShowSuggestions(false);
    setAddressError(null);
  };

  // Generador de sonido de horno "Ding"
  const playOrderSound = () => {
    try {
      const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'triangle'; 
      oscillator.frequency.setValueAtTime(1100, audioCtx.currentTime); 
      oscillator.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1); 

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5); 

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn("Feedback de audio no disponible", e);
    }
  };

  const vibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
  };

  const handleApplyCoupon = () => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (coupon) {
      onApplyCoupon(coupon);
      setCouponInput('');
      vibrate();
      showToast('¡Cupón aplicado!', 'success');
    } else {
      showToast('Cupón no válido', 'error');
    }
  };

  const handleNextStep = () => {
    if (cartItems.length === 0) return;
    vibrate();
    setStep('delivery');
  };

  const handleCheckout = () => {
    if (deliveryDetails.method === 'delivery') {
      if (!deliveryDetails.address || deliveryDetails.address.length < 5) {
        setAddressError('Por favor, ingresa una dirección válida.');
        showToast('Dirección inválida', 'error');
        return;
      }
    }
    
    vibrate();
    playOrderSound(); 
    const whatsappUrl = generateWhatsAppLink(cartItems, total, deliveryDetails, appliedCoupon);
    window.open(whatsappUrl, '_blank');
    setIsOrderSuccess(true);
  };

  const handleLocationConfirm = (address: string, coords: { lat: number; lng: number }) => {
    setDeliveryDetails(prev => ({ ...prev, address, coords }));
    setAddressError(null);
  };

  return (
    <>
      <div 
        className={`fixed inset-0 z-50 bg-vivazza-stone/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center bg-white sticky top-0 z-20">
          {step === 'delivery' && (
            <button onClick={() => setStep('cart')} className="p-2 -ml-2 mr-2 text-vivazza-stone hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
          )}
          <div className="flex-grow flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="text-vivazza-red" size={22} />
              {cartItems.length > 0 && (
                <span 
                  key={cartItems.length}
                  className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-vivazza-stone text-[8px] font-bold text-white animate-cart-pop"
                >
                  {cartItems.length}
                </span>
              )}
            </div>
            <h2 className="font-heading text-2xl text-vivazza-stone uppercase tracking-tight">
              {step === 'cart' ? 'Mi Pedido' : 'Finalizar Entrega'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-hidden relative">
          <div className={`absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${step === 'delivery' ? '-translate-x-full' : 'translate-x-0'}`}>
            
            <div className="w-full h-full flex-shrink-0 flex flex-col overflow-y-auto p-6 space-y-8 no-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} />
                  </div>
                  <p className="font-heading text-2xl uppercase tracking-widest">¿Qué pizza pedimos hoy?</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="group relative flex justify-between items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-vivazza-red/20 hover:shadow-md transition-all animate-fade-in-up">
                        <div className="flex-grow">
                          <h4 className="font-bold text-vivazza-stone text-sm uppercase leading-tight tracking-tight">{item.pizzaName}</h4>
                          {item.isCustom && <span className="inline-block mt-1 text-[9px] font-black text-vivazza-gold bg-vivazza-gold/5 px-2 py-0.5 rounded-full uppercase tracking-widest">Receta Personalizada</span>}
                          <p className="text-vivazza-red font-bold text-sm mt-1">{formatCLP(item.basePrice)}</p>
                        </div>
                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2 -mr-2">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-vivazza-cream/40 rounded-3xl p-6 border border-vivazza-gold/10">
                    <h4 className="font-heading text-lg text-vivazza-stone mb-4 uppercase flex items-center gap-2">
                      <Tag size={16} className="text-vivazza-gold" /> Completa tu combo
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {EXTRAS.map(extra => (
                        <button key={extra.id} onClick={() => onAddExtra(extra)} className="flex-shrink-0 w-28 group text-center active:scale-95 transition-transform">
                          <div className="w-full aspect-square rounded-2xl bg-white mb-2 shadow-sm border border-gray-100 overflow-hidden group-hover:border-vivazza-red/30">
                            <img src={extra.image} alt={extra.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <p className="text-[10px] font-bold text-vivazza-stone uppercase truncate px-1 mb-1">{extra.name}</p>
                          <span className="text-[10px] text-vivazza-red font-black">{formatCLP(extra.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {!appliedCoupon && (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="CÓDIGO DE CUPÓN" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-vivazza-red/20 outline-none"
                      />
                      <button onClick={handleApplyCoupon} className="bg-vivazza-stone text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                        Aplicar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="w-full h-full flex-shrink-0 overflow-y-auto p-6 space-y-8 no-scrollbar">
              <div className="space-y-6">
                <div>
                  <h4 className="font-heading text-xl text-vivazza-stone uppercase mb-4">Método de Entrega</h4>
                  <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl">
                    <button onClick={() => setDeliveryDetails(d => ({ ...d, method: 'delivery' }))} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${deliveryDetails.method === 'delivery' ? 'bg-white shadow-md text-vivazza-red scale-100' : 'text-gray-400 scale-95'}`}>
                      <Truck size={16} /> DELIVERY
                    </button>
                    <button onClick={() => setDeliveryDetails(d => ({ ...d, method: 'pickup' }))} className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${deliveryDetails.method === 'pickup' ? 'bg-white shadow-md text-vivazza-red scale-100' : 'text-gray-400 scale-95'}`}>
                      <Store size={16} /> RETIRO
                    </button>
                  </div>
                </div>

                {deliveryDetails.method === 'delivery' ? (
                  <div className="space-y-4 animate-fade-in-up">
                    <div className="space-y-2 relative">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex justify-between">
                        Dirección de Envío
                        {isSearchingAddress && <Loader2 size={12} className="animate-spin text-vivazza-red" />}
                      </label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Calle, número, ciudad..." 
                          value={deliveryDetails.address} 
                          onChange={handleAddressChange} 
                          onFocus={() => { if(addressSuggestions.length > 0) setShowSuggestions(true); }}
                          autoComplete="off"
                          className={`w-full bg-gray-50 border ${addressError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 text-sm pr-12 focus:ring-2 focus:ring-vivazza-red/20 outline-none transition-all font-medium`} 
                        />
                        <button onClick={() => setIsMapOpen(true)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-vivazza-red/10 text-vivazza-red p-2 rounded-xl hover:bg-vivazza-red hover:text-white transition-all">
                          <MapPin size={20} />
                        </button>
                      </div>

                      {/* Error Message */}
                      {addressError && (
                        <div className="flex items-center gap-1.5 text-red-500 mt-1 animate-fade-in">
                          <AlertCircle size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{addressError}</span>
                        </div>
                      )}

                      {/* Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 z-[100] mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          {addressSuggestions.map((suggestion, idx) => (
                            <button 
                              key={idx}
                              onClick={() => selectSuggestion(suggestion)}
                              className="w-full text-left p-4 hover:bg-vivazza-cream border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors group"
                            >
                              <MapPin size={16} className="text-gray-300 mt-0.5 group-hover:text-vivazza-red" />
                              <span className="text-xs font-medium text-vivazza-stone truncate">{suggestion.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notas Adicionales</label>
                      <input 
                        type="text" 
                        placeholder="Ej: Timbre malo, dejar en conserjería" 
                        value={deliveryDetails.instructions} 
                        onChange={(e) => setDeliveryDetails(d => ({ ...d, instructions: e.target.value }))} 
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-vivazza-red/20 font-medium" 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-vivazza-cream rounded-[2rem] border border-dashed border-vivazza-gold/30 text-center animate-fade-in-up">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-vivazza-gold/10">
                      <Store size={24} className="text-vivazza-gold" />
                    </div>
                    <h5 className="font-heading text-lg text-vivazza-stone mb-1 uppercase">Punto de Retiro</h5>
                    <p className="text-xs font-bold text-gray-600">1 Oriente #1234, Centro, Talca</p>
                    <p className="text-[10px] text-vivazza-red font-black mt-3 uppercase tracking-tighter bg-red-50 py-1 px-3 rounded-full inline-block">Listo en 25-35 min</p>
                  </div>
                )}

                <div className="pt-4">
                  <h4 className="font-heading text-xl text-vivazza-stone uppercase mb-4">Resumen de Pago</h4>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                      <span>Subtotal</span>
                      <span>{formatCLP(subtotal)}</span>
                    </div>
                    {appliedCoupon && (
                       <div className="flex justify-between items-center text-xs font-black text-green-600 uppercase">
                        <span>Descuento ({appliedCoupon.code})</span>
                        <span>-{formatCLP(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                      <span>Costo de Envío</span>
                      <span className="text-vivazza-stone">{deliveryDetails.method === 'delivery' ? 'POR CALCULAR' : 'GRATIS'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-50 space-y-4 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] z-30">
             <div className="flex justify-between items-end mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total a Pagar</span>
                  <span className="font-heading text-4xl text-vivazza-stone leading-none">{formatCLP(total)}</span>
                </div>
                {step === 'cart' && (
                  <div className="text-[10px] font-black bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full uppercase">
                    Paso 1 de 2
                  </div>
                )}
             </div>

             {step === 'cart' ? (
                <button 
                  onClick={handleNextStep} 
                  className="w-full bg-vivazza-red text-white py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                  SIGUIENTE <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button 
                  onClick={handleCheckout} 
                  className="w-full bg-green-600 text-white py-5 rounded-2xl font-heading text-2xl shadow-lg shadow-green-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                  ENVIAR PEDIDO <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
                </button>
             )}
             
             <div className="h-safe-bottom" />
          </div>
        )}
      </div>

      <LocationMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} onConfirm={handleLocationConfirm} />
      <OrderSuccessModal isOpen={isOrderSuccess} onClose={() => { setIsOrderSuccess(false); onClose(); setStep('cart'); }} />
    </>
  );
};

export default CartSidebar;
