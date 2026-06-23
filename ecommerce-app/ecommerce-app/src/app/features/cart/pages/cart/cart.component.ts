import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { CartSummaryComponent } from '../../components/cart-summary/cart-summary.component';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, CartItemComponent, CartSummaryComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  checkoutSuccess = false;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });
  }

  get totalBeforeDiscount(): number {
    return this.cartService.getTotalBeforeDiscount();
  }

  get totalAfterDiscount(): number {
    return this.cartService.getTotalAfterDiscount();
  }

  get totalSavings(): number {
    return this.cartService.getTotalSavings();
  }

  get itemCount(): number {
    return this.cartService.getCartCount();
  }

  onQuantityChange(event: { id: number; quantity: number }): void {
    this.cartService.updateQuantity(event.id, event.quantity);
  }

  onRemoveItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    this.checkoutSuccess = true;
    this.cartService.clearCart();
  }

  onClearCart(): void {
    this.cartService.clearCart();
  }
}
