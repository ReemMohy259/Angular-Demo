import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  isInCart = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);

    this.cartService.cart$.subscribe((items) => {
      this.isInCart = items.some((i) => i.product.id === id);
    });
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product);
    }
  }
}
