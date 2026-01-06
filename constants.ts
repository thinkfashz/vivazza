
import { Pizza, Dough, Ingredient, Coupon, ExtraItem } from './types';

export const BASE_CUSTOM_PRICE = 6000;
export const VIVAZZA_PHONE = "56932665490";
export const VIVAZZA_INSTAGRAM = "vivazzafabricadepizzas";

export const COUPONS: Coupon[] = [
  { code: 'VIVAZZA2025', discountPercent: 10, description: '10% OFF Lanzamiento' },
  { code: 'MAULE5', discountPercent: 5, description: '5% OFF Local' },
  { code: 'PIZZABREAKER', discountPercent: 15, description: '¡Premio Maestro Pizzero!' },
];

export const EXTRAS: ExtraItem[] = [
  { id: 'e1', name: 'Coca-Cola Zero 1.5L', price: 2500, category: 'drink', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
  { id: 'e3', name: 'Tiramisú Casero', price: 3900, category: 'dessert', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400&q=80' },
  { id: 'e7', name: 'Garlic Knots (4u)', price: 3500, category: 'side', image: 'https://images.unsplash.com/photo-1619531006597-827299052061?auto=format&fit=crop&w=400&q=80' },
];

export const DOUGHS: Dough[] = [
  { id: 'trad', name: 'Masa Madre Artesanal', price: 0, calories: 250, description: 'Nuestra receta única prehorneada, lista para el toque final en tu horno.' },
];

export const INGREDIENTS: Ingredient[] = [
  { id: 'moz', name: 'Queso Mozzarella', price: 1000, calories: 80, color: '#fef3c7' },
  { id: 'pep', name: 'Pepperoni', price: 1200, calories: 120, color: '#b91c1c' },
  { id: 'tom', name: 'Tomate Fresco', price: 800, calories: 20, color: '#ef4444' },
  { id: 'alb', name: 'Albahaca', price: 500, calories: 5, color: '#4ade80' },
];

// Datos extraídos de las capturas: Medianas 5.190, Grandes 7.190
export const PIZZAS: Pizza[] = [
  {
    id: 'm1',
    name: 'Margarita Mediana',
    description: 'Salsa de tomate, queso y albahaca fresca. Pizza artesanal prehorneada congelada.',
    price: 5190,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 750,
    ingredientsList: ['Salsa de tomate', 'Queso', 'Albahaca']
  },
  {
    id: 'm2',
    name: 'Margarita Grande',
    description: 'Salsa de tomate, queso y albahaca fresca. Tamaño familiar, lista para hornear.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 1100,
    ingredientsList: ['Salsa de tomate', 'Queso', 'Albahaca']
  },
  {
    id: 'v1',
    name: 'Vegetariana Mediana',
    description: 'Salsa de tomate, queso, tomate cherry, champiñones y aceitunas. Saludable y artesanal.',
    price: 5190,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 680,
    ingredientsList: ['Tomate Cherry', 'Champiñones', 'Aceitunas', 'Queso']
  },
  {
    id: 'v2',
    name: 'Vegetariana Grande',
    description: 'Mix de vegetales frescos sobre nuestra masa artesanal congelada. Ideal para compartir.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 980,
    ingredientsList: ['Tomate Cherry', 'Champiñones', 'Aceitunas', 'Queso']
  },
  {
    id: 'p1',
    name: 'Pepperoni Mediana',
    description: 'Salsa de tomate, queso y pepperoni artesanal. El clásico que nunca falla.',
    price: 5190,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 920,
    ingredientsList: ['Pepperoni', 'Mozzarella', 'Salsa de tomate']
  },
  {
    id: 'f1',
    name: 'Fugazza Mediana',
    description: 'Queso, cebolla caramelizada y orégano. Sabor intenso y tradicional.',
    price: 5190,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 850,
    ingredientsList: ['Cebolla', 'Queso', 'Orégano']
  },
  {
    id: 'n1',
    name: 'Napolitana Mediana',
    description: 'Jamón, tomate fresco y queso. Jugosa y lista para tu horno.',
    price: 5190,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10d78b7?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 880,
    ingredientsList: ['Jamón', 'Tomate', 'Queso']
  },
  {
    id: 'h1',
    name: 'Hawai Grande',
    description: 'Piña, jamón y mucho queso. Dulce y salado en perfecta armonía.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1050,
    ingredientsList: ['Piña', 'Jamón', 'Queso']
  },
  {
    id: 'viv1',
    name: 'Vivazza Grande',
    description: 'Nuestra especialidad: Selección premium de ingredientes sobre masa madre.',
    price: 7190,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1200,
    ingredientsList: ['Ingredientes Secretos', 'Mozzarella Premium']
  }
];
