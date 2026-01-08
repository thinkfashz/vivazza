
import { Pizza, Dough, Ingredient, Coupon, ExtraItem } from './types';

export const BASE_CUSTOM_PRICE = 6000;
export const VIVAZZA_PHONE = "56932665490";
export const VIVAZZA_INSTAGRAM = "vivazzafabricadepizzas";
export const VIVAZZA_CATALOG_URL = `https://wa.me/c/${VIVAZZA_PHONE}`;
export const FREE_DELIVERY_THRESHOLD = 18000;

export const VIVAZZA_LOCATION = {
  lat: -35.4264,
  lng: -71.6554,
  address: "1 Oriente #1234, Centro, Talca",
  zones: ["Centro", "Las Rastras", "La Florida", "San Clemente (Consultar)"],
  hours: "Mar - Dom: 18:30 a 23:30"
};

export const REVIEWS = [
  { id: 1, name: "Carolina M.", text: "La mejor pizza de Talca, por lejos. Se nota el reposo artesanal porque es súper ligera.", rating: 5, date: "Hace 2 días" },
  { id: 2, name: "Juan Pablo S.", text: "El envío a Las Rastras llegó perfecto. La Margarita es un 10/10.", rating: 5, date: "Hace 1 semana" },
  { id: 3, name: "Ignacio R.", text: "Pedí por el Pizza Lab y fue genial armarla a mi pinta. Ingredientes muy frescos.", rating: 4, date: "Hace 3 días" },
  { id: 4, name: "Valentina D.", text: "Adicta a los Garlic Knots. Es mi pedido fijo de todos los viernes.", rating: 5, date: "Ayer" },
  { id: 5, name: "Pedro H.", text: "Atención por WhatsApp súper rápida. Se agradece la buena onda.", rating: 5, date: "Hace 2 semanas" }
];

export const WHOLESALE_DATA = {
  doughPacks: [
    { name: "5 masas 30 cm", price: 12500 },
    { name: "10 masas 30 cm", price: 25000 },
    { name: "5 masas 25 cm", price: 11500 },
    { name: "10 masas 25 cm", price: 22000 },
  ],
  frozenPizzas: {
    flavors: ["Pepperoni", "Napolitana", "La \"Vivazza\"", "Margherita", "Fugazza", "Hawái"],
    prices: [
      { size: "Grande 32 cm", price: 6190 },
      { size: "Mediana 25 cm", price: 4190 }
    ],
    minOrder: 20
  }
};

export const INGREDIENTS: Ingredient[] = [
  // Bases y Quesos
  { id: 'moz', name: 'Mozzarella Premium', price: 1200, calories: 80, color: '#FDE68A' },
  { id: 'par', name: 'Parmesano', price: 1300, calories: 110, color: '#FEF3C7' },
  { id: 'azu', name: 'Queso Azul', price: 1800, calories: 100, color: '#D1FAE5' },
  
  // Carnes
  { id: 'pep', name: 'Pepperoni Americano', price: 1500, calories: 120, color: '#B91C1C' },
  { id: 'jam', name: 'Jamón Serrano', price: 2000, calories: 90, color: '#991B1B' },
  { id: 'toc', name: 'Tocino Ahumado', price: 1500, calories: 150, color: '#78350F' },
  { id: 'sal', name: 'Salami Italiano', price: 1400, calories: 130, color: '#991B1B' },
  { id: 'pol', name: 'Pollo Grillé', price: 1600, calories: 90, color: '#F3F4F6' },
  
  // Vegetales
  { id: 'cha', name: 'Champiñón Paris', price: 1000, calories: 15, color: '#D1D5DB' },
  { id: 'ace', name: 'Aceitunas Negras', price: 900, calories: 45, color: '#1F2937' },
  { id: 'tom', name: 'Tomate Cherry', price: 800, calories: 10, color: '#EF4444' },
  { id: 'rucu', name: 'Rúcula Fresca', price: 1200, calories: 5, color: '#10B981' },
  { id: 'pime', name: 'Pimentón Verde', price: 700, calories: 12, color: '#059669' },
  { id: 'ceb', name: 'Cebolla Morada', price: 600, calories: 15, color: '#7E22CE' },
  { id: 'choc', name: 'Choclo Dulce', price: 700, calories: 30, color: '#FDE047' },
  { id: 'palmit', name: 'Palmitos', price: 1200, calories: 25, color: '#FFFBEB' },
  
  // Toques Especiales
  { id: 'piña', name: 'Piña Caramelizada', price: 1000, calories: 40, color: '#FACC15' },
  { id: 'alb', name: 'Albahaca Orgánica', price: 500, calories: 2, color: '#34D399' },
  { id: 'aji', name: 'Ají Verde', price: 600, calories: 5, color: '#4ADE80' },
];

export const DOUGHS: Dough[] = [
  { id: 'trad', name: 'Reposo Artesanal 48h', price: 0, calories: 250, description: 'Borde alveolado, centro delgado. El estándar napolitano.' },
  { id: 'inte', name: 'Masa Integral', price: 1000, calories: 210, description: 'Mezcla de granos seleccionados para un sabor más rústico.' },
];

export const PIZZAS: Pizza[] = [
  {
    id: 'p_pep',
    name: 'Pepperoni',
    description: 'Mozzarella, salsa artesanal de la casa y pepperoni seleccionado.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 920,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Pepperoni']
  },
  {
    id: 'p_mar',
    name: 'Margherita',
    description: 'Mozzarella, salsa artesanal de la casa y pesto de albahaca fresca.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 750,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Pesto Albahaca']
  },
  {
    id: 'p_fug',
    name: 'Fugazza',
    description: 'Mozzarella, salsa artesanal de la casa, cebolla y aceitunas sevillanas.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 840,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Cebolla', 'Aceitunas']
  },
  {
    id: 'p_veg',
    name: 'Vegetariana',
    description: 'Mozzarella, salsa artesanal de la casa, tomate cherry, champiñones y albahaca fresca.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 680,
    ingredientsList: ['Tomate Cherry', 'Champiñones', 'Albahaca']
  },
  {
    id: 'p_nap',
    name: 'Napolitana',
    description: 'Mozzarella, salsa artesanal de la casa, tomate cherry, jamón y un toque de orégano rústico.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 880,
    ingredientsList: ['Mozzarella', 'Tomate Cherry', 'Jamón', 'Orégano']
  },
  {
    id: 'p_haw',
    name: 'Hawái',
    description: 'Mozzarella, salsa artesanal de la casa, jamón y piña.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 820,
    ingredientsList: ['Jamón', 'Piña', 'Mozzarella']
  },
  {
    id: 'p_viv',
    name: 'La "Vivazza"',
    description: 'Mozzarella, salsa artesanal de la casa, tocino ahumado, cebolla morada y aceitunas sevillanas.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 950,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Tocino Ahumado', 'Cebolla Morada', 'Aceitunas']
  }
];

export const EXTRAS: ExtraItem[] = [
  { id: 'e1', name: 'Garlic Knots (4u)', price: 3500, category: 'side', image: 'https://images.unsplash.com/photo-1619531006597-827299052061?auto=format&fit=crop&w=400&q=80' },
  { id: 'e2', name: 'Coca-Cola 1.5L', price: 2500, category: 'drink', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
];

export const COUPONS: Coupon[] = [
  { code: 'VIVAZZA2025', discountPercent: 10, description: '10% OFF Lanzamiento' },
  { code: 'PIZZABREAKER', discountPercent: 15, description: 'Premio Gamer' },
];
