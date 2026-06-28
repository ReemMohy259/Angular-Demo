import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { Product } from '../../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { StockStatusPipe } from '../../../../shared/pipes/stock-status.pipe';
import { IfHasStockDirective } from '../../../../shared/directives/if-has-stock.directive';
import { StockBadgeDirective } from '../../../../shared/directives/stock-badge.directive';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    CurrencyFormatPipe, StockStatusPipe,
    IfHasStockDirective, StockBadgeDirective,
  ],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  private route       = inject(ActivatedRoute);
  private cartService = inject(CartService);

  readonly product  = signal<Product | undefined>(undefined);
  readonly isInCart = computed(() => {
    const p = this.product();
    return p ? this.cartService.isInCart(p.id) : false;
  });
  readonly savings = computed(() => {
    const p = this.product();
    return p ? p.originalPrice - p.price : 0;
  });

  ngOnInit(): void {
    // Resolver already fetched the product — just read it from route data
    const resolved = this.route.snapshot.data['product'] as Product | undefined;
    this.product.set(resolved);
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cartService.addToCart(p);
  }
}
