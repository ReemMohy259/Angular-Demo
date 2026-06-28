import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // ── Core signal ───────────────────────────────────────────────────────────
  readonly cartItems = signal<CartItem[]>([]);

  // ── Derived signals (computed) ────────────────────────────────────────────
  readonly cartCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalBeforeDiscount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0)
  );

  readonly totalAfterDiscount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly totalSavings = computed(() =>
    this.totalBeforeDiscount() - this.totalAfterDiscount()
  );

  readonly cartProductIds = computed(() =>
    new Set(this.cartItems().map((i) => i.product.id))
  );

  private readonly apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) {}

  // ── HTTP-ready methods (currently manage signal, HTTP wired for future) ───

  addToCart(product: Product): void {
    const current = this.cartItems();
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      this.cartItems.set(
        current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this.cartItems.set([...current, { product, quantity: 1 }]);
    }

    // HTTP: this.http.post(`${this.apiUrl}/add`, { productId: product.id }).subscribe();
  }

  removeFromCart(productId: number): void {
    this.cartItems.set(this.cartItems().filter((item) => item.product.id !== productId));
    // HTTP: this.http.delete(`${this.apiUrl}/remove/${productId}`).subscribe();
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }
    this.cartItems.set(
      this.cartItems().map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
    // HTTP: this.http.put(`${this.apiUrl}/update`, { productId, quantity }).subscribe();
  }

  clearCart(): void {
    this.cartItems.set([]);
    // HTTP: this.http.delete(`${this.apiUrl}/clear`).subscribe();
  }

  isInCart(productId: number): boolean {
    return this.cartProductIds().has(productId);
  }
}
