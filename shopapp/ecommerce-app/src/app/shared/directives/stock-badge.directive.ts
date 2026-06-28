import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

/**
 * Custom Attribute Directive — StockBadgeDirective
 *
 * Usage:  <span appStockBadge [stockValue]="product.stock">
 *
 * Demonstrates:
 *  - Attribute binding (sets HTML attribute + DOM property dynamically)
 *  - OnChanges lifecycle — reacts when @Input changes
 *  - Renderer2 setAttribute / setStyle / addClass
 */
@Directive({
  selector: '[appStockBadge]',
  standalone: true,
})
export class StockBadgeDirective implements OnChanges {
  @Input() stockValue: number = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stockValue']) {
      this.applyBadge(this.stockValue);
    }
  }

  private applyBadge(stock: number): void {
    const el = this.el.nativeElement;

    // HTML attribute manipulation (setAttribute)
    this.renderer.setAttribute(el, 'data-stock', String(stock));

    // DOM style manipulation
    if (stock === 0) {
      this.renderer.setStyle(el, 'color', '#dc2626');
      this.renderer.setStyle(el, 'fontWeight', '600');
      this.renderer.setAttribute(el, 'title', 'Out of stock');
    } else if (stock <= 5) {
      this.renderer.setStyle(el, 'color', '#d97706');
      this.renderer.setStyle(el, 'fontWeight', '600');
      this.renderer.setAttribute(el, 'title', 'Low stock warning');
    } else {
      this.renderer.setStyle(el, 'color', '#16a34a');
      this.renderer.removeAttribute(el, 'title');
    }
  }
}
