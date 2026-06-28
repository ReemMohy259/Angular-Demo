import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  // ── Signal-based inputs (Angular 17+) ─────────────────────────────────────
  product = input.required<Product>();
  isInCart = input<boolean>(false);

  // ── Signal-based output ───────────────────────────────────────────────────
  addToCart = output<Product>();

  onAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
