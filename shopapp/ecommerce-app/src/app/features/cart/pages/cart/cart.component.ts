import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent, CartSummaryComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  protected cartService    = inject(CartService);
  readonly checkoutSuccess = signal(false);

  onQuantityChange(event: { id: number; quantity: number }): void {
    this.cartService.updateQuantity(event.id, event.quantity);
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    this.cartService.clearCart();
    this.checkoutSuccess.set(true);
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
