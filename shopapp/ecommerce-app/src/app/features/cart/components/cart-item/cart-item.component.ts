import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  // ── Signal inputs ─────────────────────────────────────────────────────────
  item = input.required<CartItem>();

  // ── Signal outputs ────────────────────────────────────────────────────────
  quantityChange = output<{ id: number; quantity: number }>();
  removeItem     = output<number>();

  // ── Computed values ───────────────────────────────────────────────────────
  readonly itemTotal = computed(() => this.item().product.price * this.item().quantity);
  readonly itemTotalOriginal = computed(() => this.item().product.originalPrice * this.item().quantity);
  readonly itemSavings = computed(() => this.itemTotalOriginal() - this.itemTotal());

  // ── Event handlers ────────────────────────────────────────────────────────
  onQuantityInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value >= 0) {
      this.quantityChange.emit({ id: this.item().product.id, quantity: value });
    }
  }

  increment(): void {
    this.quantityChange.emit({ id: this.item().product.id, quantity: this.item().quantity + 1 });
  }

  decrement(): void {
    const current = this.item().quantity;
    if (current > 1) {
      this.quantityChange.emit({ id: this.item().product.id, quantity: current - 1 });
    } else {
      this.removeItem.emit(this.item().product.id);
    }
  }

  onRemove(): void {
    this.removeItem.emit(this.item().product.id);
  }
}
