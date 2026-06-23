import { Component, OnInit } from '@angular/core';
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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  cartProductIds: Set<number> = new Set();

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.cartService.cart$.subscribe((items) => {
      this.cartProductIds = new Set(items.map((i) => i.product.id));
    });
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  isInCart(productId: number): boolean {
    return this.cartProductIds.has(productId);
  }
}
