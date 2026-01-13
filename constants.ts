
import { Pizza, Dough, Ingredient, Coupon, ExtraItem } from './types';

export const VIVAZZA_PHONE = "56932665490";
export const VIVAZZA_INSTAGRAM = "vivazzafabricadepizzas";
export const VIVAZZA_CATALOG_URL = `https://wa.me/c/${VIVAZZA_PHONE}`;
export const FREE_DELIVERY_THRESHOLD = 18000;

// Added BASE_CUSTOM_PRICE to resolve import error in PizzaLab.tsx
export const BASE_CUSTOM_PRICE = 5990;

export const VIVAZZA_LOCATION = {
  lat: -35.4264,
  lng: -71.6554,
  address: "1 Oriente #1234, Centro, Talca",
  zones: ["Centro", "Las Rastras", "La Florida", "San Clemente (Consultar)"],
  hours: "Mar - Dom: 18:30 a 23:30"
};

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Don Humberto",
    role: "Panadero Senior",
    text: "Llevo 40 años en hornos y nunca vi una masa así en Talca. Esas 72 horas no son marketing, es pura maestría técnica. Es aire puro.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 2,
    name: "Valentina Rossi",
    role: "Sommelier & Foodie",
    text: "La 'Vivazza' es un viaje sensorial. La ligereza de la masa permite que el vino se luzca. Simplemente la mejor pizza que he comido en el país.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 3,
    name: "Marcos 'Torito' Silva",
    role: "Atleta de Alto Rendimiento",
    text: "Lo que más valoro es que no me siento pesado después de comer. Es mi 'cheat meal' oficial porque la digestión es increíble gracias al reposo.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 4,
    name: "Elena de las Mercedes",
    role: "Abuela & Crítica de Cocina",
    text: "Me recuerda a la pizza que hacían en el campo, con paciencia. Los cherrys explotan de sabor. No pido en otro lado, mis nietos la aman.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 5,
    name: "Lucas P.",
    role: "Arquitecto",
    text: "La estructura de la masa es arquitectura pura. Esos alveolos internos solo se logran con el reposo sagrado. Estética y sabor 10/10.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 6,
    name: "Sofía Arancibia",
    role: "Chef Ejecutiva",
    text: "Como profesional, busco trazabilidad en los ingredientes. Vivazza usa productos de primer nivel. Es el estándar de oro del delivery en el Maule.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 7,
    name: "Raúl G.",
    role: "Turista Gastronómico",
    text: "He probado pizza en Nápoles y Nueva York. Vivazza no tiene nada que envidiarles. La Fugazza es una locura de cebollas caramelizadas.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: 8,
    name: "Camila V.",
    role: "Organizadora de Eventos",
    text: "Siempre que pido para reuniones quedo como reina. Llega caliente, la presentación es de lujo y todos preguntan dónde la compramos.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
    rating: 5
  }
];

export const REVIEWS = [
  { id: 1, name: "Carolina M.", text: "La mejor pizza de Talca, por lejos. Se nota el reposo sagrado porque es súper ligera.", rating: 5, date: "Hace 2 días" },
  { id: 2, name: "Juan Pablo S.", text: "El envío a Las Rastras llegó perfecto. La Margarita es un 10/10.", rating: 5, date: "Hace 1 semana" },
  { id: 3, name: "Ignacio R.", text: "Pedí por el catálogo y fue genial. Ingredientes muy frescos.", rating: 4, date: "Hace 3 días" },
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
  // Added color property to ingredients to fix error in PizzaLab.tsx visualization
  { id: 'moz', name: 'Mozzarella Premium', price: 1200, calories: 80, color: '#FEF9E7' },
  { id: 'par', name: 'Parmesano', price: 1300, calories: 110, color: '#FDF2E9' },
  { id: 'azu', name: 'Queso Azul', price: 1800, calories: 100, color: '#D6EAF8' },
  { id: 'pep', name: 'Pepperoni Americano', price: 1500, calories: 120, color: '#E74C3C' },
  { id: 'jam', name: 'Jamón Serrano', price: 2000, calories: 90, color: '#943126' },
  { id: 'toc', name: 'Tocino Ahumado', price: 1500, calories: 150, color: '#641E16' },
  { id: 'sal', name: 'Salami Italiano', price: 1400, calories: 130, color: '#7B241C' },
  { id: 'pol', name: 'Pollo Grillé', price: 1600, calories: 90, color: '#FAD7A0' },
  { id: 'cha', name: 'Champiñón Paris', price: 1000, calories: 15, color: '#EBEDEF' },
  { id: 'ace', name: 'Aceitunas Negras', price: 900, calories: 45, color: '#1C2833' },
  { id: 'tom', name: 'Tomate Cherry', price: 800, calories: 10, color: '#EC7063' },
  { id: 'rucu', name: 'Rúcula Fresca', price: 1200, calories: 5, color: '#229954' },
  { id: 'pime', name: 'Pimentón Verde', price: 700, calories: 12, color: '#1E8449' },
  { id: 'ceb', name: 'Cebolla Morada', price: 600, calories: 15, color: '#7D3C98' },
  { id: 'choc', name: 'Choclo Dulce', price: 700, calories: 30, color: '#F4D03F' },
  { id: 'palmit', name: 'Palmitos', price: 1200, calories: 25, color: '#FEF9E7' },
  { id: 'piña', name: 'Piña Caramelizada', price: 1000, calories: 40, color: '#F7DC6F' },
  { id: 'alb', name: 'Albahaca Orgánica', price: 500, calories: 2, color: '#28B463' },
  { id: 'aji', name: 'Ají Verde', price: 600, calories: 5, color: '#1D8348' },
];

export const DOUGHS: Dough[] = [
  { id: 'trad', name: 'Reposo Sagrado', price: 0, calories: 250, description: '72 horas de maduración lenta. El estándar napolitano.' },
];

export const PIZZAS: Pizza[] = [
  {
    id: 'p_pep',
    name: 'Pepperoni',
    description: 'Mozzarella, salsa artesanal de la casa y pepperoni seleccionado.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    type: 'traditional',
    calories: 920,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Pepperoni']
  },
  {
    id: 'p_mar',
    name: 'Margherita',
    description: 'Mozzarella, salsa artesanal de la casa y pesto de albahaca fresca.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    type: 'traditional',
    calories: 750,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Pesto Albahaca']
  },
  {
    id: 'p_fug',
    name: 'Fugazza',
    description: 'Mozzarella, salsa artesanal de la casa, cebolla y aceitunas sevillanas.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=600&q=80',
    type: 'traditional',
    calories: 840,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Cebolla', 'Aceitunas']
  },
  {
    id: 'p_veg',
    name: 'Vegetariana',
    description: 'Mozzarella, salsa artesanal de la casa, tomate cherry, champiñones y albahaca fresca.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    type: 'traditional',
    calories: 680,
    ingredientsList: ['Tomate Cherry', 'Champiñones', 'Albahaca']
  },
  {
    id: 'p_nap',
    name: 'Napolitana',
    description: 'Mozzarella, salsa artesanal de la casa, tomate cherry, jamón y un toque de orégano rústico.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=600&q=80',
    type: 'special',
    calories: 880,
    ingredientsList: ['Mozzarella', 'Tomate Cherry', 'Jamón', 'Orégano']
  },
  {
    id: 'p_haw',
    name: 'Hawái',
    description: 'Mozzarella, salsa artesanal de la casa, jamón y piña.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    type: 'traditional',
    calories: 820,
    ingredientsList: ['Jamón', 'Piña', 'Mozzarella']
  },
  {
    id: 'p_viv',
    name: 'La "Vivazza"',
    description: 'Mozzarella, salsa artesanal de la casa, tocino ahumado, cebolla morada y aceitunas sevillanas.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=600&q=80',
    type: 'special',
    calories: 950,
    ingredientsList: ['Mozzarella', 'Salsa Artesanal', 'Tocino Ahumado', 'Cebolla Morada', 'Aceitunas']
  }
];

export const EXTRAS: ExtraItem[] = [
  { id: 'e1', name: 'Garlic Knots (4u)', price: 3500, category: 'side', image: 'https://images.unsplash.com/photo-1619531006597-827299052061?auto=format&fit=crop&w=300&q=80' },
  { id: 'e2', name: 'Coca-Cola 1.5L', price: 2500, category: 'drink', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300&q=80' },
];

export const COUPONS: Coupon[] = [
  { code: 'VIVAZZA2025', discountPercent: 10, description: '10% OFF Lanzamiento' },
  { code: 'PIZZABREAKER', discountPercent: 15, description: 'Premio Gamer' },
];
