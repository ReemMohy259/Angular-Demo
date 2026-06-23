import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  addToCart(product: Product): void {
    const existing = this.cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.cartSubject.next([...this.cartItems]);
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.product.id !== productId);
    this.cartSubject.next([...this.cartItems]);
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find((i) => i.product.id === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        item.quantity = quantity;
        this.cartSubject.next([...this.cartItems]);
      }
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next([]);
  }

  getCartCount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalBeforeDiscount(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.originalPrice * item.quantity,
      0
    );
  }

  getTotalAfterDiscount(): number {
    return this.cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  getTotalSavings(): number {
    return this.getTotalBeforeDiscount() - this.getTotalAfterDiscount();
  }

  isInCart(productId: number): boolean {
    return this.cartItems.some((item) => item.product.id === productId);
  }
}
