import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() item!: CartItem;

  @Output() quantityChange = new EventEmitter<{ id: number; quantity: number }>();
  @Output() removeItem = new EventEmitter<number>();

  get itemTotal(): number {
    return this.item.product.price * this.item.quantity;
  }

  get itemTotalOriginal(): number {
    return this.item.product.originalPrice * this.item.quantity;
  }

  get itemSavings(): number {
    return this.itemTotalOriginal - this.itemTotal;
  }

  onQuantityInput(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value >= 0) {
      this.quantityChange.emit({ id: this.item.product.id, quantity: value });
    }
  }

  increment(): void {
    this.quantityChange.emit({ id: this.item.product.id, quantity: this.item.quantity + 1 });
  }

  decrement(): void {
    if (this.item.quantity > 1) {
      this.quantityChange.emit({ id: this.item.product.id, quantity: this.item.quantity - 1 });
    } else {
      this.removeItem.emit(this.item.product.id);
    }
  }

  onRemove(): void {
    this.removeItem.emit(this.item.product.id);
  }
}
