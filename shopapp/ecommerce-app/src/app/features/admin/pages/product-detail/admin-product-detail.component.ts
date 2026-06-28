import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { CartService } from '../../../../core/services/cart.service';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { IfHasStockDirective } from '../../../../shared/directives/if-has-stock.directive';
import { StockBadgeDirective } from '../../../../shared/directives/stock-badge.directive';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { StockStatusPipe } from '../../../../shared/pipes/stock-status.pipe';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-product-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    HighlightDirective, IfHasStockDirective, StockBadgeDirective,
    CurrencyFormatPipe, StockStatusPipe,
    ConfirmModalComponent,
  ],
  templateUrl: './admin-product-detail.component.html',
  styleUrls: ['./admin-product-detail.component.scss'],
})
export class AdminProductDetailComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private productService = inject(ProductService);
  private cartService    = inject(CartService);

  readonly product  = signal<Product | undefined>(undefined);
  readonly isInCart = computed(() => {
    const p = this.product();
    return p ? this.cartService.isInCart(p.id) : false;
  });
  readonly savings = computed(() => {
    const p = this.product();
    return p ? p.originalPrice - p.price : 0;
  });
  readonly ratingClass = computed(() => {
    const r = this.product()?.rating ?? 0;
    return {
      'rating--high':   r >= 4.5,
      'rating--medium': r >= 3.5 && r < 4.5,
      'rating--low':    r < 3.5,
    };
  });

  // ── Delete state ──────────────────────────────────────────────────────────
  showDeleteModal = signal(false);
  deleting        = signal(false);

  ngOnInit(): void {
    const resolved = this.route.snapshot.data['product'] as Product | undefined;
    this.product.set(resolved);
  }

  addToCart(): void {
    const p = this.product();
    if (p) this.cartService.addToCart(p);
  }

  requestDelete(): void { this.showDeleteModal.set(true); }
  cancelDelete():  void { this.showDeleteModal.set(false); }

  confirmDelete(): void {
    const p = this.product();
    if (!p) return;
    this.deleting.set(true);
    this.productService.deleteProduct(p.id).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: () => this.deleting.set(false),
    });
  }
}
