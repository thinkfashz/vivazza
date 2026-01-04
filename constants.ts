import { Pizza, Dough, Ingredient } from './types';

export const BASE_CUSTOM_PRICE = 7000;

export const DOUGHS: Dough[] = [
  { id: 'trad', name: 'Tradicional Artesanal', price: 0, calories: 250, description: 'Masa madre con 48hrs de fermentación.' },
  { id: 'thin', name: 'Fina a la Piedra', price: 0, calories: 200, description: 'Crocante, ligera y delicada.' },
  { id: 'cheese', name: 'Borde de Queso', price: 2500, calories: 400, description: 'Rellena con mozzarella fundida.' },
  { id: 'whole', name: 'Integral Rústica', price: 1000, calories: 220, description: 'Harina integral orgánica de molino local.' },
];

export const INGREDIENTS: Ingredient[] = [
  { id: 'tom_sc', name: 'Tomates San Clemente', price: 800, calories: 20 },
  { id: 'moz_premium', name: 'Mozzarella Premium', price: 1200, calories: 80 },
  { id: 'pep_art', name: 'Pepperoni Artesanal', price: 1500, calories: 120 },
  { id: 'jam_serr', name: 'Jamón Serrano', price: 2000, calories: 90 },
  { id: 'champ', name: 'Champiñones Frescos', price: 1000, calories: 15 },
  { id: 'olivas', name: 'Aceitunas de Azapa', price: 1000, calories: 30 },
  { id: 'rucula', name: 'Rúcula Fresca', price: 800, calories: 5 },
  { id: 'nueces', name: 'Nueces de Pencahue', price: 1200, calories: 180 },
  { id: 'blue', name: 'Queso Azul', price: 1500, calories: 100 },
  { id: 'cherry', name: 'Tomates Cherry', price: 900, calories: 25 },
  { id: 'tocino', name: 'Tocino Ahumado', price: 1500, calories: 140 },
  { id: 'albahaca', name: 'Albahaca de la Huerta', price: 500, calories: 2 },
];

export const PIZZAS: Pizza[] = [
  {
    id: 'p1',
    name: 'Margarita del Maule',
    description: 'La clásica, perfeccionada. Salsa de tomates de San Clemente, mozzarella fior di latte y albahaca fresca.',
    price: 9500,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 800,
    ingredientsList: ['Salsa Pomodoro', 'Mozzarella', 'Albahaca'],
    history: 'Nuestra Margarita honra los tomates cultivados en la zona de San Clemente, seleccionados a mano cada mañana.'
  },
  {
    id: 'p2',
    name: 'Pepperoni Intenso',
    description: 'Doble carga de pepperoni curado artesanalmente sobre nuestra base de queso fundido.',
    price: 11500,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 1200,
    ingredientsList: ['Pepperoni', 'Mozzarella', 'Orégano'],
    history: 'El pepperoni que usamos es ahumado con maderas nativas del sur, trayendo un sabor inconfundible.'
  },
  {
    id: 'p3',
    name: 'Napolitana Chilena',
    description: 'Un clásico local. Jamón cocido de alta calidad, tomates frescos, aceitunas y orégano.',
    price: 10900,
    image: 'https://images.unsplash.com/photo-1595854341625-f33ee10d78b7?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 950,
    ingredientsList: ['Jamón', 'Tomate', 'Aceitunas', 'Mozzarella'],
    history: 'Inspirada en las onces familiares maulinas, elevando los ingredientes a un estándar gourmet.'
  },
  {
    id: 's1',
    name: 'La Pencahue',
    description: 'Especialidad de la casa con queso azul, peras caramelizadas y nueces tostadas de Pencahue.',
    price: 14500,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1100,
    ingredientsList: ['Queso Azul', 'Peras', 'Nueces', 'Miel'],
    history: 'Un homenaje a los valles interiores de Talca. El contraste dulce-salado es nuestra firma desde 2021.'
  },
  {
    id: 's2',
    name: 'Serrano Rústica',
    description: 'Base blanca (sin tomate), mozzarella, jamón serrano reserva, rúcula y láminas de parmesano.',
    price: 15900,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 980,
    ingredientsList: ['Jamón Serrano', 'Rúcula', 'Parmesano', 'Aceite de Oliva'],
    history: 'Creada para paladares exigentes que buscan ligereza y profundidad de sabor.'
  },
   {
    id: 's3',
    name: 'Vegetariana de la Huerta',
    description: 'Mix de vegetales asados al horno de barro: pimientos, berenjenas, zapallo italiano y champiñones.',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    type: 'traditional',
    calories: 850,
    ingredientsList: ['Pimientos', 'Berenjenas', 'Champiñones', 'Zapallo Italiano'],
    history: 'Directo de productores locales en la feria de Talca a tu mesa.'
  },
   {
    id: 's4',
    name: 'Carnivora Premium',
    description: 'Para los amantes de la carne: Carne mechada, tocino ahumado, pepperoni y chorizo.',
    price: 16500,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    type: 'special',
    calories: 1500,
    ingredientsList: ['Carne Mechada', 'Tocino', 'Chorizo', 'Pepperoni'],
    history: 'Una bomba de sabor con cocciones lentas de más de 6 horas para la carne mechada.'
  }
];