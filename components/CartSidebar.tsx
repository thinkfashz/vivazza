import React, { useState } from 'react';
import { CartItem, DeliveryDetails } from '../types';
import { formatCLP } from '../utils';
import { X, ShoppingBag, MapPin, Store, Trash2, Send } from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onRemoveItem }) => {
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    method: 'delivery',
    address: '',
    instructions: ''
  });

  const total = cartItems.reduce((sum, item) => sum + (item.basePrice * item.quantity), 0);
  const deliveryFee = delivery.method === 'delivery' ? 2000 : 0;
  const finalTotal = total + deliveryFee;

  const validateAddress = (address: string) => {
    const talcaKeywords = ['talca', 'maule', 'centro', 'las rastras', 'la florida', 'bicentenario'];
    const lowerAddr = address.toLowerCase();
    return talcaKeywords.some(k => lowerAddr.includes(k));
  };

  const handleCheckout = () => {
    if (delivery.method === 'delivery') {
      if (!delivery.address.trim()) return alert("Por favor ingresa una dirección.");
      if (!validateAddress(delivery.address)) {
        if (!confirm("Parece que tu dirección no menciona Talca explícitamente. ¿Continuar igual?")) return;
      }
    }

    const itemsList = cartItems.map((item, idx) => {
      let details = `${idx + 1}. ${item.pizzaName} (x${item.quantity})`;
      if (item.isCustom) {
        details += `\n   - Masa: ${item.dough?.name}`;
        if (item.customIngredients?.length) {
          details += `\n   - Extras: ${item.customIngredients.map(i => i.name).join(', ')}`;
        }
      }
      return details;
    }).join('\n');

    const message = `*NUEVO PEDIDO VIVAZZA TALCA* 🍕
--------------------------------
Modalidad: *${delivery.method === 'delivery' ? 'DELIVERY 🛵' : 'RETIRO EN LOCAL 🏪'}*
${delivery.method === 'delivery' ? `Dirección: ${delivery.address}\nInstrucciones: ${delivery.instructions}` : ''}
--------------------------------
*ITEMS:*
${itemsList}
--------------------------------
*Subtotal:* ${formatCLP(total)}
*Envío:* ${formatCLP(deliveryFee)}
*TOTAL A PAGAR:* ${formatCLP(finalTotal)}
--------------------------------
¡Gracias!`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/56912345678?text=${encodedMsg}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-vivazza-cream z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 bg-vivazza-stone text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <ShoppingBag />
            <h2 className="font-heading text-2xl tracking-wide">Tu Pedido</h2>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-grain space-y-6">
          
          {cartItems.length === 0 ? (
            <div className="text-center py-20 opacity-50">
              <ShoppingBag size={48} className="mx-auto mb-4" />
              <p>Tu carrito está vacío.</p>
              <p className="text-sm">¡Agrega algo delicioso!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between group">
                  <div>
                    <h4 className="font-bold text-vivazza-stone">{item.pizzaName}</h4>
                    <p className="text-xs text-gray-500 mb-1">
                      {item.isCustom ? 'Customizada' : 'Tradicional'} x{item.quantity}
                    </p>
                    <p className="text-vivazza-red font-mono text-sm">{formatCLP(item.basePrice * item.quantity)}</p>
                  </div>
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-heading text-xl text-vivazza-stone">Opciones de Entrega</h3>
              
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => setDelivery(prev => ({ ...prev, method: 'delivery' }))}
                  className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${delivery.method === 'delivery' ? 'bg-white text-vivazza-stone shadow-sm' : 'text-gray-500'}`}
                >
                  <MapPin size={16} /> Delivery
                </button>
                <button 
                  onClick={() => setDelivery(prev => ({ ...prev, method: 'pickup' }))}
                  className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${delivery.method === 'pickup' ? 'bg-white text-vivazza-stone shadow-sm' : 'text-gray-500'}`}
                >
                  <Store size={16} /> Retiro
                </button>
              </div>

              {delivery.method === 'delivery' && (
                <div className="space-y-3 animate-fade-in-up">
                  <input 
                    type="text"
                    placeholder="Dirección en Talca..."
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-vivazza-red bg-gray-50"
                    value={delivery.address}
                    onChange={(e) => setDelivery(prev => ({...prev, address: e.target.value}))}
                  />
                  <input 
                    type="text"
                    placeholder="Instrucciones (opcional)"
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-vivazza-red bg-gray-50"
                    value={delivery.instructions}
                    onChange={(e) => setDelivery(prev => ({...prev, instructions: e.target.value}))}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-2 text-sm text-gray-500">
              <span>Subtotal</span>
              <span>{formatCLP(total)}</span>
            </div>
            {delivery.method === 'delivery' && (
              <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
                <span>Envío (Radio Urbano)</span>
                <span>{formatCLP(deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <span className="font-heading text-2xl text-vivazza-stone">Total</span>
              <span className="font-heading text-3xl text-vivazza-red">{formatCLP(finalTotal)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-xl font-heading text-xl shadow-lg hover:shadow-green-200 transition-all flex items-center justify-center gap-3"
            >
              <Send size={22} />
              Pedir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;