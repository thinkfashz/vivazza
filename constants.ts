
import { Pizza, Dough, Ingredient, Coupon, ExtraItem } from './types';

export const BASE_CUSTOM_PRICE = 7000;

export const OPENING_HOUR = 12; // 12:00 PM
export const CLOSING_HOUR = 23; // 11:00 PM

export const COUPONS: Coupon[] = [
  { code: 'VIVAZZA2025', discountPercent: 10, description: '10% OFF Lanzamiento' },
  { code: 'MAULE5', discountPercent: 5, description: '5% OFF Local' },
  { code: 'GAMERWIN', discountPercent: 15, description: '¡Premio Pizza Breaker!' },
];

export const EXTRAS: ExtraItem[] = [
  { id: 'e1', name: 'Coca-Cola Zero 1.5L', price: 2500, category: 'drink', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
  { id: 'e2', name: 'Cerveza Artesanal IPA', price: 3500, category: 'drink', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=400&q=80' },
  { id: 'e3', name: 'Tiramisú Casero', price: 3900, category: 'dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80' },
  { id: 'e4', name: 'Agua Mineral 500ml', price: 1500, category: 'drink', image: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=400&q=80' },
  { id: 'e5', name: 'Sprite 1.5L', price: 2500, category: 'drink', image: 'https://images.unsplash.com/photo-1625772290748-390944add67e?auto=format&fit=crop&w=400&q=80' },
  { id: 'e6', name: 'Brownie de Chocolate', price: 2200, category: 'dessert', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400&q=80' },
  { id: 'e7', name: 'Garlic Knots (4u)', price: 3500, category: 'side', image: 'https://images.unsplash.com/photo-1619531006597-827299052061?auto=format&fit=crop&w=400&q=80' },
  { id: 'e8', name: 'Salsa Garlic Dip', price: 1200, category: 'side', image: 'https://images.unsplash.com/photo-1585325701166-381ca9130013?auto=format&fit=crop&w=400&q=80' },
  { id: 'e9', name: 'Pesto Albahaca & Nuez', price: 1800, category: 'side', image: 'https://images.unsplash.com/photo-1590779033100-9f60702a0559?auto=format&fit=crop&w=400&q=80' },
  { id: 'e10', name: 'Ensalada Caprese', price: 5900, category: 'salad', image: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=400&q=80' },
  { id: 'e11', name: 'Limonada Menta-Jengibre', price: 2900, category: 'drink', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80' },
  { id: 'e12', name: 'Focaccia al Rosmarino', price: 4200, category: 'side', image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400&q=80' },
  { id: 'e13', name: 'Cheesecake de Arándanos', price: 4500, category: 'dessert', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=80' },
  { id: 'e14', name: 'Cerveza Amber Ale Local', price: 3800, category: 'drink', image: 'https://images.unsplash.com/photo-1571767499270-138347257c48?auto=format&fit=crop&w=400&q=80' },
];

export const DOUGHS: Dough[] = [
  { id: 'trad', name: 'Tradicional Artesanal', price: 0, calories: 250, description: 'Masa madre viva, fermentada 48hrs. Ligera y digerible.' },
  { id: 'thin', name: 'Fina a la Piedra', price: 0, calories: 200, description: 'Crunch extremo. La base perfecta para sentir los ingredientes.' },
  { id: 'cheese', name: 'Borde de Queso', price: 2500, calories: 400, description: '¡Pecado mortal! Borde relleno de mozzarella fundida y elástica.' },
  { id: 'whole', name: 'Integral Rústica', price: 1000, calories: 220, description: 'Sabor a campo. Harina integral orgánica de molino local.' },
];

export const INGREDIENTS: Ingredient[] = [
  { id: 'tom_sc', name: 'Tomates San Clemente', price: 800, calories: 20, color: '#ef4444' },
  { id: 'moz_premium', name: 'Mozzarella Premium', price: 1200, calories: 80, color: '#fef3c7' },
  { id: 'pep_art', name: 'Pepperoni Artesanal', price: 1500, calories: 120, color: '#b91c1c' },
  { id: 'jam_serr', name: 'Jamón Serrano', price: 2000, calories: 90, color: '#f87171' },
  { id: 'champ', name: 'Champiñones Frescos', price: 1000, calories: 15, color: '#d6d3d1' },
  { id: 'olivas', name: 'Aceitunas de Azapa', price: 1000, calories: 30, color: '#292524' },
  { id: 'rucula', name: 'Rúcula Fresca', price: 800, calories: 5, color: '#65a30d' },
  { id: 'nueces', name: 'Nueces de Pencahue', price: 1200, calories: 180, color: '#78350f' },
  { id: 'blue', name: 'Queso Azul Cremoso', price: 1500, calories: 100, color: '#bfdbfe' },
  { id: 'cherry', name: 'Tomates Cherry', price: 900, calories: 25, color: '#dc2626' },
  { id: 'tocino', name: 'Tocino Ahumado', price: 1500, calories: 140, color: '#991b1b' },
  { id: 'albahaca', name: 'Albahaca de la Huerta', price: 500, calories: 2, color: '#4ade80' },
];

export const PIZZAS: Pizza[] = [
  {
    id: 'p1',
    name: 'Margarita Real',
    description: 'La perfección existe. Salsa de tomates San Clemente vibrante, mozzarella fior di latte fundida y el aroma inconfundible de la albahaca recién cortada.',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 800,
    ingredientsList: ['Salsa Pomodoro', 'Mozzarella Fior di Latte', 'Albahaca Fresca'],
    history: 'Simple, pero sublime. Honramos el tomate maulino seleccionado a mano cada mañana.'
  },
  {
    id: 'p2',
    name: 'Pepperoni Obsession',
    description: '¿Amas el Pepperoni? Esto es otro nivel. Doble capa de pepperoni curado artesanalmente, bordes crujientes y un toque ahumado irresistible.',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 1200,
    ingredientsList: ['Doble Pepperoni', 'Mozzarella', 'Orégano de Monte'],
    history: 'Ahumado con maderas nativas del sur. Un sabor intenso que no podrás olvidar.'
  },
  {
    id: 'p3',
    name: 'Napolitana Nostra',
    description: 'Jugosa y reconfortante. Jamón cocido de pierna, tomates frescos que explotan en la boca, aceitunas carnosas y orégano.',
    price: 10900,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10d78b7?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 950,
    ingredientsList: ['Jamón Pierna', 'Tomate Fresco', 'Aceitunas Azapa', 'Mozzarella'],
    history: 'El clásico chileno elevado a categoría gourmet. Sabor a once familiar, pero mejor.'
  },
  {
    id: 's1',
    name: 'La Pencahue (Dulce & Salado)',
    description: 'Una experiencia gourmet atrevida. Queso azul intenso suavizado por peras caramelizadas y el crunch de nueces tostadas.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1100,
    ingredientsList: ['Queso Azul', 'Peras Caramelizadas', 'Nueces', 'Toque de Miel'],
    history: 'Un homenaje a los valles interiores. El contraste que ha enamorado a Talca desde 2021.'
  },
  {
    id: 's2',
    name: 'Serrano Rústica',
    description: 'Elegancia pura. Base blanca cremosa, jamón serrano reserva curado 12 meses, rúcula fresca picante y láminas de parmesano.',
    price: 15900,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 980,
    ingredientsList: ['Jamón Serrano Reserva', 'Rúcula', 'Parmesano Reggiano', 'Oliva Extra Virgen'],
    history: 'Para paladares exigentes. Una pizza ligera, fresca y con una profundidad de sabor increíble.'
  },
   {
    id: 's3',
    name: 'Huerta Asada',
    description: 'Vegetales que saben a gloria. Pimientos, berenjenas y zapallitos asados lentamente al horno de barro para concentrar su dulzor.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 850,
    ingredientsList: ['Pimientos Asados', 'Berenjenas', 'Champiñones', 'Zapallo Italiano'],
    history: 'Del huerto a tu mesa. Seleccionamos lo mejor de la feria de Talca cada semana.'
  },
   {
    id: 's4',
    name: 'Carnívora Brutal',
    description: 'Solo para valientes. Carne mechada deshilachada (cocción 6 horas), tocino ahumado crocante, chorizo y pepperoni.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1500,
    ingredientsList: ['Carne Mechada', 'Tocino Ahumado', 'Chorizo', 'Pepperoni'],
    history: 'Una bomba de sabor umami. Nuestra carne mechada se deshace en la boca.'
  }
];
