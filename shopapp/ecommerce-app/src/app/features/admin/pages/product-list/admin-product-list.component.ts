import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';
import { StockBadgeDirective } from '../../../../shared/directives/stock-badge.directive';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { StockStatusPipe } from '../../../../shared/pipes/stock-status.pipe';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule,
    HighlightDirective, StockBadgeDirective,
    CurrencyFormatPipe, StockStatusPipe,
    ConfirmModalComponent,
  ],
  templateUrl: './admin-product-list.component.html',
  styleUrls: ['./admin-product-list.component.scss'],
})
export class AdminProductListComponent implements OnInit {
  protected productService = inject(ProductService);
  private  route           = inject(ActivatedRoute);

  searchTerm      = signal('');
  sortField       = signal<keyof Product>('name');
  sortAsc         = signal(true);
  deleteTargetId  = signal<number | null>(null);    // id of product pending delete
  deleteTargetName = signal('');
  deleting        = signal(false);
  deleteError     = signal<string | null>(null);

  readonly filtered = computed(() => {
    const term = this.searchTerm().toLowerCase();
    let list = this.productService.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
    const field = this.sortField();
    return [...list].sort((a, b) => {
      const av = a[field], bv = b[field];
      if (typeof av === 'string' && typeof bv === 'string')
        return this.sortAsc() ? av.localeCompare(bv) : bv.localeCompare(av);
      return this.sortAsc()
        ? (av as number) - (bv as number)
        : (bv as number) - (av as number);
    });
  });

  ngOnInit(): void {
    // Resolver has already populated the products signal
    void this.route.snapshot.data['products'];
  }

  sort(field: keyof Product): void {
    if (this.sortField() === field) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
  }

  // ── Delete flow ────────────────────────────────────────────────────────────
  requestDelete(product: Product): void {
    this.deleteTargetId.set(product.id);
    this.deleteTargetName.set(product.name);
    this.deleteError.set(null);
  }

  cancelDelete(): void {
    this.deleteTargetId.set(null);
    this.deleteTargetName.set('');
  }

  confirmDelete(): void {
    const id = this.deleteTargetId();
    if (id === null) return;

    this.deleting.set(true);
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.deleteTargetId.set(null);
        this.deleteTargetName.set('');
      },
      error: () => {
        this.deleting.set(false);
        this.deleteError.set('Delete failed. Please try again.');
      },
    });
  }
}
