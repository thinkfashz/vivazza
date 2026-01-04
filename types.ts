export type PizzaType = 'traditional' | 'special' | 'custom';

export interface Ingredient {
  id: string;
  name: string;
  price: number;
  calories: number;
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
  ingredientsList: string[]; // List of ingredient names for display
  history?: string; // Story for the modal
}

export interface CartItem {
  id: string; // Unique ID for the cart item (timestamp based)
  pizzaName: string;
  basePrice: number;
  quantity: number;
  isCustom: boolean;
  dough?: Dough; // Only for custom
  customIngredients?: Ingredient[]; // Only for custom
}

export interface DeliveryDetails {
  method: 'delivery' | 'pickup';
  address: string;
  instructions: string;
}