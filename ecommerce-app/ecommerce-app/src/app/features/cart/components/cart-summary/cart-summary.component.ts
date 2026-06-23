import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  @Input() totalBeforeDiscount = 0;
  @Input() totalAfterDiscount = 0;
  @Input() totalSavings = 0;
  @Input() itemCount = 0;

  @Output() checkout = new EventEmitter<void>();
  @Output() clearCart = new EventEmitter<void>();

  get discountPercent(): number {
    if (this.totalBeforeDiscount === 0) return 0;
    return Math.round((this.totalSavings / this.totalBeforeDiscount) * 100);
  }

  onCheckout(): void {
    this.checkout.emit();
  }

  onClearCart(): void {
    this.clearCart.emit();
  }
}
