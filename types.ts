export type PizzaType = 'traditional' | 'special' | 'custom';

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  calories: number;
  color?: string; // For visual builder
}

export interface Dough {
  id: string;
  name: string;
  price: number;
  calories: number;
  description: string;
}

export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: PizzaType;
  calories: number;
  ingredientsList: string[];
  history?: string;
}

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'drink' | 'dessert';
}

export interface CartItem {
  id: string;
  pizzaName: string;
  basePrice: number;
  quantity: number;
  isCustom: boolean;
  dough?: Dough;
  customIngredients?: Ingredient[];
  isExtra?: boolean; // Flag to identify upsell items
}

export interface DeliveryDetails {
  method: 'delivery' | 'pickup';
  address: string;
  instructions: string;
  coords?: {
    lat: number;
    lng: number;
  };
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
}

export interface HighScore {
  name: string;
  score: number;
  date: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}