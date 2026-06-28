import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {
  protected productService = inject(ProductService);
  private   cartService    = inject(CartService);

  // No ngOnInit needed — resolver already populated the signal before this component loads

  isInCart(productId: number): boolean {
    return this.cartService.isInCart(productId);
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
