
"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { CartItem, ExtraItem, Coupon, DeliveryDetails, ToastType } from '../types';
import { EXTRAS, FREE_DELIVERY_THRESHOLD } from '../constants';
import { formatCLP, generateWhatsAppLink } from '../utils';
import { X, Trash2, ChevronRight, ArrowLeft, Home, Truck, Store, MapPin, ShieldCheck, ShoppingBag, Navigation } from 'lucide-react';
import OrderSuccessModal from './OrderSuccessModal';

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
    name: '',
    address: '',
    instructions: ''
  });
  
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0), [cartItems]);
  const discount = useMemo(() => appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0, [subtotal, appliedCoupon]);
  const total = subtotal - discount;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setAddressError(null);
        setNameError(null);
      }, 300);
    }
  }, [isOpen]);

  const detectLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            const cleanAddress = data.display_name.split(',').slice(0, 3).join(',');
            setDeliveryDetails(prev => ({
              ...prev,
              address: cleanAddress,
              coords: { lat: latitude, lng: longitude }
            }));
            setAddressError(null);
          }
        } catch (error) {
          console.error("Error geocoding", error);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        alert("No pudimos obtener tu ubicación automáticamente. Por favor, escribe tu dirección.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleCheckout = () => {
    if (!deliveryDetails.name || deliveryDetails.name.length < 2) {
      setNameError('Tu nombre es necesario');
      return;
    }

    if (deliveryDetails.method === 'delivery' && (!deliveryDetails.address || deliveryDetails.address.length < 5)) {
        setAddressError('Dirección incompleta');
        return;
    }
    const whatsappUrl = generateWhatsAppLink(cartItems, total, deliveryDetails, appliedCoupon);
    window.open(whatsappUrl, '_blank');
    setIsOrderSuccess(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end font-display">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Main Drawer */}
      <div className="relative w-full md:max-w-md bg-[#f8f7f7] dark:bg-[#1d1d20] h-full flex flex-col shadow-2xl animate-slide-in-right overflow-hidden">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#1d1d20]/80 backdrop-blur-md px-4 py-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between shrink-0">
          <button 
            onClick={step === 'delivery' ? () => setStep('cart') : onClose}
            className="flex size-10 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {step === 'delivery' ? <ArrowLeft size={20} /> : <X size={20} />}
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-tight dark:text-white">
            {step === 'cart' ? 'Tu Pedido' : 'Finalizar Pedido'}
          </h1>
          <div className="size-10"></div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
          
          <div className="px-4 py-6">
            <div className="flex items-center justify-between max-w-xs mx-auto relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 dark:bg-white/10 -translate-y-1/2 z-0"></div>
              
              <div className="z-10 flex flex-col items-center gap-1">
                <div className={`h-3 w-3 rounded-full ring-4 ${step === 'cart' ? 'bg-[#cf1736] ring-[#cf1736]/20' : 'bg-[#cf1736] ring-transparent'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 'cart' ? 'text-[#cf1736]' : 'text-gray-400'}`}>Carrito</span>
              </div>
              
              <div className="z-10 flex flex-col items-center gap-1">
                <div className={`h-3 w-3 rounded-full transition-all ${step === 'delivery' ? 'bg-[#cf1736] ring-4 ring-[#cf1736]/20' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 'delivery' ? 'text-[#cf1736]' : 'text-gray-400'}`}>Envío</span>
              </div>
              
              <div className="z-10 flex flex-col items-center gap-1">
                <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">WhatsApp</span>
              </div>
            </div>
          </div>

          {step === 'cart' ? (
            <div className="px-4 animate-fade-in">
              <h3 className="text-[#1b0e10] dark:text-white tracking-tight text-2xl font-bold leading-tight pb-4">Detalles</h3>
              
              {cartItems.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
                  <ShoppingBag size={64} strokeWidth={1} />
                  <p className="font-bold mt-4">Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-[#252528] rounded-xl px-4 min-h-[88px] py-3 soft-ui-shadow">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="size-16 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-black/5">
                           <ShoppingBag size={24} className="text-gray-200" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <p className="text-[#1b0e10] dark:text-white text-base font-bold leading-tight truncate">{item.pizzaName}</p>
                          <p className="text-[#974e5a] dark:text-[#c4717f] text-xs font-normal leading-tight mt-1 truncate">
                            {item.quantity}x Receta Original
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="text-[#1b0e10] dark:text-white text-base font-bold">{formatCLP(item.basePrice * item.quantity)}</p>
                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-300 hover:text-primary transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="mt-10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Acompaña tu pedido</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {EXTRAS.map(extra => (
                        <button 
                          key={extra.id} 
                          onClick={() => onAddExtra(extra)}
                          className="bg-white dark:bg-[#252528] p-3 rounded-xl soft-ui-shadow border border-black/5 flex items-center gap-3 active:scale-95 transition-transform"
                        >
                          <div className="size-10 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                            <img src={extra.image} className="w-full h-full object-cover" alt={extra.name} />
                          </div>
                          <div className="text-left overflow-hidden">
                            <p className="text-[10px] font-bold truncate dark:text-white">{extra.name}</p>
                            <p className="text-[10px] text-primary font-bold">{formatCLP(extra.price)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 animate-fade-in space-y-8">
              <h3 className="text-[#1b0e10] dark:text-white tracking-tight text-2xl font-bold leading-tight">Envío</h3>
              
              <div className="flex p-1 bg-gray-200/50 dark:bg-white/5 rounded-2xl">
                <button 
                  onClick={() => setDeliveryDetails(d => ({ ...d, method: 'delivery' }))}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${deliveryDetails.method === 'delivery' ? 'bg-white dark:bg-[#252528] shadow-sm text-primary' : 'text-gray-500'}`}
                >
                  <Truck size={16} /> DELIVERY
                </button>
                <button 
                  onClick={() => setDeliveryDetails(d => ({ ...d, method: 'pickup' }))}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${deliveryDetails.method === 'pickup' ? 'bg-white dark:bg-[#252528] shadow-sm text-primary' : 'text-gray-500'}`}
                >
                  <Store size={16} /> RETIRO
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-[#252528] rounded-2xl p-4 soft-ui-shadow border border-black/5">
                  <div className="flex gap-3 items-center">
                    <Home size={20} className="text-primary flex-shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Tu Nombre"
                      value={deliveryDetails.name}
                      onChange={(e) => {setDeliveryDetails(d => ({ ...d, name: e.target.value })); setNameError(null);}}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full dark:text-white placeholder:text-gray-300"
                    />
                  </div>
                  {nameError && <p className="text-[10px] text-primary font-bold mt-2 ml-8">{nameError}</p>}
                </div>

                {deliveryDetails.method === 'delivery' && (
                  <>
                    <button 
                      onClick={detectLocation}
                      disabled={isLocating}
                      className="w-full bg-white dark:bg-[#252528] border border-primary/20 p-4 rounded-2xl soft-ui-shadow flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
                    >
                      <Navigation size={18} className={`${isLocating ? 'animate-spin' : 'text-primary animate-pulse'}`} />
                      <span className="text-xs font-bold text-vivazza-stone dark:text-white uppercase tracking-wider">
                        {isLocating ? 'Buscando satélites...' : 'Usar mi ubicación actual'}
                      </span>
                    </button>

                    <div className="bg-white dark:bg-[#252528] rounded-2xl p-4 soft-ui-shadow border border-black/5">
                      <div className="flex gap-3 items-start">
                        <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <input 
                            type="text"
                            placeholder="Calle y Número"
                            value={deliveryDetails.address}
                            onChange={(e) => {setDeliveryDetails(d => ({ ...d, address: e.target.value })); setAddressError(null);}}
                            className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full dark:text-white placeholder:text-gray-300"
                          />
                          <input 
                            type="text"
                            placeholder="Depto / Referencias"
                            value={deliveryDetails.instructions}
                            onChange={(e) => setDeliveryDetails(d => ({ ...d, instructions: e.target.value }))}
                            className="bg-transparent border-none p-0 focus:ring-0 text-xs font-medium w-full text-gray-400 mt-1"
                          />
                        </div>
                      </div>
                    </div>
                    {addressError && <p className="text-[10px] text-primary font-bold mt-1">{addressError}</p>}
                  </>
                )}
              </div>
            </div>
          )}

          <div className="px-6 py-8 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Subtotal</span>
              <span className="font-bold dark:text-white">{formatCLP(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-primary">
                <span className="font-medium">Cupón Aplicado</span>
                <span className="font-bold">-{formatCLP(discount)}</span>
              </div>
            )}
            <div className="h-px bg-black/5 dark:bg-white/10 my-4"></div>
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-black dark:text-white uppercase tracking-tight">Total</span>
              <span className="text-3xl font-black text-primary">{formatCLP(total)}</span>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 right-0 w-full md:max-w-md bg-white/80 dark:bg-[#1d1d20]/90 backdrop-blur-xl border-t border-black/5 p-4 pb-10 z-[60]">
          <button 
            disabled={cartItems.length === 0}
            onClick={step === 'cart' ? () => setStep('delivery') : handleCheckout}
            className={`w-full bg-primary hover:brightness-110 text-white rounded-xl py-4 flex items-center justify-center gap-3 soft-ui-shadow transition-all active:scale-[0.98] ${cartItems.length === 0 ? 'opacity-50 grayscale' : ''}`}
          >
            {step === 'cart' ? (
              <>
                <span className="font-bold text-lg tracking-tight">Continuar</span>
                <ChevronRight size={20} />
              </>
            ) : (
              <>
                <svg className="size-6 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.4-16.5-14.7-27.6-32.8-30.8-38.4-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
                <span className="font-bold text-lg tracking-tight">Confirmar por WhatsApp</span>
              </>
            )}
          </button>
          <div className="mt-4 flex items-center justify-center gap-1.5 opacity-50">
            <ShieldCheck size={14} className="text-gray-400" />
            <span className="text-[9px] font-black uppercase tracking-widest dark:text-white">Pago seguro & artesanal</span>
          </div>
        </footer>
      </div>

      <OrderSuccessModal isOpen={isOrderSuccess} onClose={() => { setIsOrderSuccess(false); onClose(); setStep('cart'); }} />
    </div>
  );
};

export default CartSidebar;
