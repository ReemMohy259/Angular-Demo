export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number; // percentage
  image: string;
  category: string;
  rating: number;
  stock: number;
}
