
"use client";
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CartItem, ExtraItem, Coupon, DeliveryDetails, ToastType } from '../types';
import { EXTRAS, COUPONS, FREE_DELIVERY_THRESHOLD } from '../constants';
import { formatCLP, generateWhatsAppLink } from '../utils';
import { X, ShoppingBag, Trash2, ChevronRight, ChevronLeft, Tag, Truck, MapPin, MessageCircle, Store, AlertCircle, Loader2, Gift, User } from 'lucide-react';
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
  
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [couponInput, setCouponInput] = useState('');
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0), [cartItems]);
  const discount = useMemo(() => appliedCoupon ? (subtotal * appliedCoupon.discountPercent / 100) : 0, [subtotal, appliedCoupon]);
  const total = subtotal - discount;

  const freeDeliveryProgress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remainingForFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);

  useEffect(() => {
    if (!isOpen) {
      setShowSuggestions(false);
      setAddressError(null);
      setNameError(null);
      setStep('cart');
    }
  }, [isOpen]);

  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 3) return;
    setIsSearchingAddress(true);
    try {
      const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lat=-35.4264&lon=-71.6554`);
      const data = await response.json();
      const suggestions = data.features.map((f: any) => ({
        label: [f.properties.name, f.properties.street, f.properties.housenumber, f.properties.city].filter(Boolean).join(', '),
        coords: { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] }
      }));
      setAddressSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } catch (e) { console.error(e); } finally { setIsSearchingAddress(false); }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDeliveryDetails(d => ({ ...d, address: value }));
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (value.length >= 3) {
      searchTimeoutRef.current = setTimeout(() => fetchAddressSuggestions(value), 500);
    }
  };

  const handleCheckout = () => {
    if (!deliveryDetails.name || deliveryDetails.name.length < 2) {
      setNameError('Ingresa tu nombre');
      showToast('Por favor, ingresa tu nombre', 'error');
      return;
    }

    if (deliveryDetails.method === 'delivery' && (!deliveryDetails.address || deliveryDetails.address.length < 5)) {
        setAddressError('Ingresa una dirección válida');
        showToast('Por favor, indica tu dirección de despacho', 'error');
        return;
    }
    const whatsappUrl = generateWhatsAppLink(cartItems, total, deliveryDetails, appliedCoupon);
    window.open(whatsappUrl, '_blank');
    setIsOrderSuccess(true);
  };

  return (
    <>
      <div className={`fixed inset-0 z-50 bg-vivazza-stone/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[60] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        
        <div className="px-6 py-5 border-b border-gray-100 flex items-center bg-white sticky top-0 z-20">
          {step === 'delivery' && (
            <button onClick={() => setStep('cart')} className="p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={24} /></button>
          )}
          <h2 className="font-heading text-2xl uppercase tracking-tight flex-grow">
            {step === 'cart' ? '🛒 Mi Pedido' : '🛵 Datos de Pedido'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <div className="flex-grow overflow-hidden relative">
          <div className={`absolute inset-0 flex transition-transform duration-500 ${step === 'delivery' ? '-translate-x-full' : 'translate-x-0'}`}>
            
            <div className="w-full h-full flex-shrink-0 flex flex-col overflow-y-auto p-6 space-y-6 no-scrollbar">
              
              {cartItems.length > 0 && (
                <div className="bg-vivazza-cream p-5 rounded-3xl border border-vivazza-gold/20 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black uppercase text-gray-500 flex items-center gap-2">
                      <Truck size={14} className="text-vivazza-red" /> 
                      {remainingForFreeDelivery > 0 ? `Faltan ${formatCLP(remainingForFreeDelivery)} para envío gratis` : '¡ENVÍO GRATIS CONSEGUIDO!'}
                    </span>
                    <Gift size={16} className={remainingForFreeDelivery === 0 ? "text-vivazza-gold animate-bounce" : "text-gray-300"} />
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner">
                    <div className="h-full bg-vivazza-red transition-all duration-1000" style={{ width: `${freeDeliveryProgress}%` }} />
                  </div>
                </div>
              )}

              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 py-20">
                  <ShoppingBag size={64} className="mb-4" />
                  <p className="font-heading text-2xl uppercase">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex-grow">
                          <h4 className="font-bold text-sm uppercase truncate">{item.pizzaName}</h4>
                          <p className="text-vivazza-red font-bold text-sm">{formatCLP(item.basePrice)} <span className="text-[9px] text-gray-400 font-medium">IVA incl.</span></p>
                        </div>
                        <button onClick={() => onRemoveItem(item.id)} className="text-gray-300 hover:text-red-500 p-2"><Trash2 size={18} /></button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-vivazza-stone text-white rounded-[2rem] p-6 shadow-xl">
                    <h4 className="font-heading text-xl mb-4 flex items-center gap-2 uppercase">
                      <Tag size={18} className="text-vivazza-gold" /> ¿Algo más?
                    </h4>
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                      {EXTRAS.map(extra => (
                        <button key={extra.id} onClick={() => onAddExtra(extra)} className="flex-shrink-0 w-24 group active:scale-95 transition-all">
                          <div className="w-full aspect-square rounded-2xl bg-white/10 mb-2 overflow-hidden border border-white/10 group-hover:border-vivazza-red">
                            <img src={extra.image} alt={extra.name} className="w-full h-full object-cover" />
                          </div>
                          <p className="text-[9px] font-black uppercase truncate mb-1">{extra.name}</p>
                          <span className="text-[10px] text-vivazza-gold font-black">{formatCLP(extra.price)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-full h-full flex-shrink-0 overflow-y-auto p-6 space-y-6 no-scrollbar">
              <h4 className="font-heading text-xl uppercase mb-4">Información de Entrega</h4>
              
              <div className="space-y-4 animate-fade-in-up">
                <div className="relative">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tu Nombre</label>
                  <div className="relative mt-1">
                    <input 
                      type="text" 
                      placeholder="Ej: Juan Pérez" 
                      value={deliveryDetails.name} 
                      onChange={(e) => {setDeliveryDetails(d => ({ ...d, name: e.target.value })); setNameError(null);}} 
                      className={`w-full bg-gray-50 border ${nameError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 text-sm font-medium pl-12`} 
                    />
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-gray-100 p-1.5 rounded-2xl mb-6">
                <button onClick={() => setDeliveryDetails(d => ({ ...d, method: 'delivery' }))} className={`py-3 rounded-xl text-xs font-black transition-all ${deliveryDetails.method === 'delivery' ? 'bg-white shadow-md text-vivazza-red' : 'text-gray-400'}`}>DELIVERY</button>
                <button onClick={() => setDeliveryDetails(d => ({ ...d, method: 'pickup' }))} className={`py-3 rounded-xl text-xs font-black transition-all ${deliveryDetails.method === 'pickup' ? 'bg-white shadow-md text-vivazza-red' : 'text-gray-400'}`}>RETIRO LOCAL</button>
              </div>

              {deliveryDetails.method === 'delivery' && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="relative">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tu Dirección en Talca</label>
                    <div className="relative mt-1">
                      <input type="text" placeholder="Calle, N°, Población..." value={deliveryDetails.address} onChange={handleAddressChange} className={`w-full bg-gray-50 border ${addressError ? 'border-red-500' : 'border-gray-100'} rounded-2xl p-4 text-sm font-medium pr-12`} />
                      <button onClick={() => setIsMapOpen(true)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-vivazza-red text-white p-2 rounded-xl"><MapPin size={18} /></button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4 animate-fade-in-up">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Instrucciones Adicionales</label>
                <input type="text" placeholder="Departamento, timbre, casa color..." value={deliveryDetails.instructions} onChange={(e) => setDeliveryDetails(d => ({ ...d, instructions: e.target.value }))} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium" />
              </div>
              
              <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-3">
                 <div className="flex justify-between text-xs font-bold text-gray-400"><span>SUBTOTAL</span><span>{formatCLP(subtotal)}</span></div>
                 <div className="flex justify-between text-xs font-bold text-gray-400"><span>DESCUENTO</span><span>{formatCLP(discount)}</span></div>
                 <div className="flex justify-between text-lg font-black text-vivazza-stone border-t pt-3 uppercase"><span>Total aprox</span><span>{formatCLP(total)}</span></div>
                 <p className="text-[9px] text-gray-400 font-bold text-right uppercase tracking-widest">IVA INCLUIDO EN TODOS LOS PRECIOS</p>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-center px-4 leading-relaxed italic">
                El total final será confirmado por nuestro personal vía WhatsApp incluyendo el costo de envío según tu zona.
              </p>
            </div>

          </div>
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-50 z-30">
             {step === 'cart' ? (
                <button onClick={() => setStep('delivery')} className="w-full bg-vivazza-red text-white py-5 rounded-2xl font-heading text-2xl shadow-red flex items-center justify-center gap-3 active:scale-95 transition-all">
                  CONTINUAR CON EL PEDIDO <ChevronRight size={24} />
                </button>
             ) : (
                <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-5 rounded-2xl font-heading text-2xl shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                  FINALIZAR EN WHATSAPP <MessageCircle size={24} />
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
