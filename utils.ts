
export const formatCLP = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateWhatsAppLink = (cartItems: any[], total: number, delivery: any, coupon: any) => {
  const phone = "56912345678"; // Reemplazar con número real de Vivazza
  
  let message = `🍕 *NUEVO PEDIDO VIVAZZA*\n`;
  message += `--------------------------\n\n`;
  
  cartItems.forEach(item => {
    message += `*${item.quantity}x ${item.pizzaName}*\n`;
    if (item.isCustom) {
      message += `  - Masa: ${item.dough?.name}\n`;
      message += `  - Ingredientes: ${item.customIngredients?.map((i: any) => i.name).join(', ')}\n`;
    }
    message += `  Subtotal: ${formatCLP(item.basePrice)}\n\n`;
  });

  message += `--------------------------\n`;
  if (coupon) {
    message += `🎟️ *Cupón:* ${coupon.code} (-${coupon.discountPercent}%)\n`;
  }
  message += `💰 *TOTAL A PAGAR: ${formatCLP(total)}*\n\n`;
  
  message += `📍 *ENTREGA:* ${delivery.method === 'delivery' ? 'Domicilio' : 'Retiro en Local'}\n`;
  if (delivery.method === 'delivery') {
    message += `🏠 *Dirección:* ${delivery.address}\n`;
  }
  if (delivery.instructions) {
    message += `📝 *Instrucciones:* ${delivery.instructions}\n`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
