import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-summary.component.html',
  styleUrls: ['./cart-summary.component.scss'],
})
export class CartSummaryComponent {
  // ── Signal inputs ─────────────────────────────────────────────────────────
  totalBeforeDiscount = input<number>(0);
  totalAfterDiscount  = input<number>(0);
  totalSavings        = input<number>(0);
  itemCount           = input<number>(0);

  // ── Signal outputs ────────────────────────────────────────────────────────
  checkout  = output<void>();
  clearCart = output<void>();

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly discountPercent = computed(() => {
    const before = this.totalBeforeDiscount();
    return before === 0 ? 0 : Math.round((this.totalSavings() / before) * 100);
  });

  onCheckout(): void  { this.checkout.emit(); }
  onClearCart(): void { this.clearCart.emit(); }
}
