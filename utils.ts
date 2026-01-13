
import { VIVAZZA_PHONE } from './constants';

export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateWhatsAppLink = (cartItems: any[], total: number, delivery: any, coupon: any) => {
  const phone = VIVAZZA_PHONE; 
  
  let message = `🚀 *NUEVO PEDIDO VIVAZZA*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  
  message += `👤 *CLIENTE:* ${delivery.name.toUpperCase()}\n\n`;

  cartItems.forEach((item, index) => {
    message += `${index + 1}. *${item.quantity}x ${item.pizzaName.toUpperCase()}*\n`;
    message += `   └ _Precio:_ ${formatCLP(item.basePrice * item.quantity)}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━\n`;
  if (coupon) {
    message += `🎟️ *Cupón Aplicado:* ${coupon.code} (-${coupon.discountPercent}%)\n`;
  }
  message += `💰 *TOTAL A PAGAR: ${formatCLP(total)} (IVA incl.)*\n\n`;
  
  message += `🛵 *MODALIDAD:* ${delivery.method === 'delivery' ? 'DOMICILIO' : 'RETIRO LOCAL'}\n`;
  if (delivery.method === 'delivery') {
    message += `📍 *Dirección:* ${delivery.address}\n`;
    if (delivery.coords) {
      message += `🗺️ *GPS:* https://www.google.com/maps?q=${delivery.coords.lat},${delivery.coords.lng}\n`;
    }
  }
  if (delivery.instructions) {
    message += `💬 *Notas:* ${delivery.instructions}\n`;
  }

  message += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  message += `⏰ _Confírmenme tiempo de entrega por favor._`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
