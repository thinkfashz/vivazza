
"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem, ExtraItem, Coupon, DeliveryDetails, ToastType } from '../types';
import { EXTRAS, COUPONS, FREE_DELIVERY_THRESHOLD } from '../constants';
import { formatCLP, generateWhatsAppLink } from '../utils';
import { X, ShoppingBag, Trash2, ChevronRight, ChevronLeft, Tag, Truck, MapPin, MessageCircle, Store, AlertCircle, Loader2, Gift, User, ArrowLeft, Check } from 'lucide-react';
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
    name: '',
    address: '',
    instructions: ''
  });
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0), [cartItems]);
  const discount = useMemo(() => appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0, [subtotal, appliedCoupon]);
  const total = subtotal - discount;

  const freeDeliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remainingForFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('cart');
        setAddressError(null);
        setNameError(null);
      }, 300);
    }
  }, [isOpen]);

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

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-50 bg-vivazza-stone/60 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />

      {/* Sidebar / Full-screen Mobile */}
      <div 
        className={`fixed right-0 top-0 h-full w-full md:max-w-md bg-white z-[60] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col pt-safe-top`}
      >
        {/* Mobile Handle Bar */}
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mt-4 mb-2 md:hidden" />

        {/* Header Dinámico */}
        <header className="px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {step === 'delivery' && (
              <button 
                onClick={() => setStep('cart')} 
                className="p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-colors text-vivazza-stone"
                aria-label="Volver al carrito"
              >
                <ArrowLeft size={24} />
              </button>
            )}
            <h2 className="font-heading text-3xl uppercase tracking-tighter text-vivazza-stone">
              {step === 'cart' ? 'Mi Pedido' : 'Despacho'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </header>

        {/* Contenedor con Transición Lateral */}
        <div className="flex-grow relative overflow-hidden">
          <div 
            className={`absolute inset-0 flex transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${step === 'delivery' ? '-translate-x-full' : 'translate-x-0'}`}
          >
            {/* VISTA 1: CARRITO */}
            <div className="w-full h-full flex-shrink-0 flex flex-col overflow-y-auto no-scrollbar p-6 space-y-8">
              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-20 py-20">
                  <ShoppingBag size={80} strokeWidth={1} />
                  <p className="font-heading text-3xl uppercase mt-4">Carrito vacío</p>
                </div>
              ) : (
                <>
                  {/* Progress Bar Premium */}
                  <div className="bg-vivazza-cream p-6 rounded-[2.5rem] border border-vivazza-gold/10 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="flex items-center gap-2">
                        <Truck size={14} className="text-vivazza-red" /> 
                        {remainingForFreeDelivery > 0 ? 'Falta poco...' : '¡ENVÍO GRATIS!'}
                      </span>
                      <span className="text-vivazza-red">{formatCLP(remainingForFreeDelivery)}</span>
                    </div>
                    <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner p-0.5">
                      <div 
                        className="h-full bg-vivazza-red rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(166,29,36,0.3)]" 
                        style={{ width: `${freeDeliveryProgress}%` }} 
                      />
                    </div>
                  </div>

                  {/* Lista de Items */}
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="group flex items-center gap-4 p-4 bg-gray-50/50 rounded-3xl border border-gray-100 hover:border-vivazza-red/10 transition-all">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-vivazza-red shadow-sm border border-gray-50 flex-shrink-0">
                          <ShoppingBag size={24} />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm uppercase tracking-tight text-vivazza-stone truncate">{item.pizzaName}</h4>
                          <p className="text-vivazza-red font-black text-sm">{formatCLP(item.basePrice * item.quantity)}</p>
                        </div>
                        <button 
                          onClick={() => onRemoveItem(item.id)} 
                          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          aria-label="Quitar item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upsell: EXTRAS */}
                  <div className="pt-4">
                    <h4 className="font-heading text-2xl uppercase mb-6 flex items-center gap-2">
                      <Tag size={18} className="text-vivazza-gold" /> ¿Para acompañar?
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {EXTRAS.map(extra => (
                        <button 
                          key={extra.id} 
                          onClick={() => onAddExtra(extra)} 
                          className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl hover:border-vivazza-red transition-all active:scale-95 text-left group shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                            <img src={extra.image} alt={extra.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-black uppercase truncate text-gray-400">{extra.name}</p>
                            <p className="text-xs font-bold text-vivazza-red">{formatCLP(extra.price)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* VISTA 2: DATOS ENTREGA */}
            <div className="w-full h-full flex-shrink-0 flex flex-col overflow-y-auto no-scrollbar p-6 space-y-8">
              {/* Selector de Método */}
              <div className="flex p-1.5 bg-gray-100 rounded-3xl">
                <button 
                  onClick={() => setDeliveryDetails(d => ({ ...d, method: 'delivery' }))} 
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${deliveryDetails.method === 'delivery' ? 'bg-white shadow-xl text-vivazza-red scale-105' : 'text-gray-400'}`}
                >
                  <Truck size={16} /> DELIVERY
                </button>
                <button 
                  onClick={() => setDeliveryDetails(d => ({ ...d, method: 'pickup' }))} 
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${deliveryDetails.method === 'pickup' ? 'bg-white shadow-xl text-vivazza-red scale-105' : 'text-gray-400'}`}
                >
                  <Store size={16} /> RETIRO
                </button>
              </div>

              {/* Formulario Mobile-Optimized */}
              <div className="space-y-6">
                {/* Nombre */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tu Nombre Completo</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-vivazza-red transition-colors" size={20} />
                    <input 
                      type="text" 
                      placeholder="Ej: Pedro Pascal" 
                      value={deliveryDetails.name} 
                      onChange={(e) => {setDeliveryDetails(d => ({ ...d, name: e.target.value })); setNameError(null);}} 
                      className={`w-full h-16 bg-gray-50/50 border-2 ${nameError ? 'border-red-500' : 'border-gray-100'} rounded-3xl pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-vivazza-red outline-none transition-all shadow-inner`} 
                    />
                  </div>
                </div>

                {/* Dirección / Mapa */}
                {deliveryDetails.method === 'delivery' && (
                  <div className="space-y-2 animate-fade-in-up">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Dirección en Talca</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-vivazza-red transition-colors" size={20} />
                      <input 
                        type="text" 
                        readOnly
                        placeholder="Usa el mapa para marcar..." 
                        value={deliveryDetails.address} 
                        onClick={() => setIsMapOpen(true)}
                        className={`w-full h-16 bg-gray-50/50 border-2 ${addressError ? 'border-red-500' : 'border-gray-100'} rounded-3xl pl-12 pr-16 text-sm font-bold focus:bg-white cursor-pointer outline-none shadow-inner`} 
                      />
                      <button 
                        onClick={() => setIsMapOpen(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-vivazza-red text-white p-3 rounded-2xl shadow-red active:scale-90 transition-all"
                      >
                        <MapPin size={20} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Instrucciones */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instrucciones (Opcional)</label>
                  <div className="relative group">
                    <MessageCircle className="absolute left-4 top-5 text-gray-300 group-focus-within:text-vivazza-red transition-colors" size={20} />
                    <textarea 
                      placeholder="Portón negro, dejar en conserjería..." 
                      value={deliveryDetails.instructions} 
                      onChange={(e) => setDeliveryDetails(d => ({ ...d, instructions: e.target.value }))} 
                      className="w-full bg-gray-50/50 border-2 border-gray-100 rounded-3xl pl-12 pr-4 pt-5 pb-5 text-sm font-bold focus:bg-white focus:border-vivazza-red outline-none transition-all shadow-inner resize-none h-32" 
                    />
                  </div>
                </div>
              </div>

              {/* Resumen Final */}
              <div className="bg-vivazza-stone text-white rounded-[2.5rem] p-8 space-y-4 shadow-xl">
                 <div className="flex justify-between items-center text-xs opacity-60">
                   <span>SUBTOTAL</span>
                   <span className="font-bold">{formatCLP(subtotal)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs opacity-60">
                   <span>DESCUENTO</span>
                   <span className="font-bold text-vivazza-gold">-{formatCLP(discount)}</span>
                 </div>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="font-heading text-3xl uppercase tracking-tighter">TOTAL</span>
                    <span className="font-heading text-5xl text-vivazza-gold leading-none">{formatCLP(total)}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de Acciones (Fixed Bottom) */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 pb-safe-bottom z-40">
             {step === 'cart' ? (
                <button 
                  onClick={() => setStep('delivery')} 
                  className="w-full h-18 bg-vivazza-red text-white rounded-2xl font-heading text-2xl shadow-red flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                  CONTINUAR AL DESPACHO <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
             ) : (
                <button 
                  onClick={handleCheckout} 
                  className="w-full h-18 bg-green-600 text-white rounded-2xl font-heading text-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  CONFIRMAR EN WHATSAPP <MessageCircle size={24} />
                </button>
             )}
          </div>
        )}
      </div>

      <LocationMap isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} onConfirm={(addr, crd) => {setDeliveryDetails(d => ({ ...d, address: addr, coords: crd })); setAddressError(null);}} />
      <OrderSuccessModal isOpen={isOrderSuccess} onClose={() => { setIsOrderSuccess(false); onClose(); setStep('cart'); }} />
    </>
  );
};

export default CartSidebar;
