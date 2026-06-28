import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * Custom Structural Directive — IfHasStockDirective
 *
 * Usage:  <div *appIfHasStock="product.stock">Only shown when in stock</div>
 *
 * Demonstrates:
 *  - Structural directive (manipulates the DOM by inserting/removing views)
 *  - TemplateRef + ViewContainerRef pattern (same as *ngIf internally)
 *  - OnChanges to react to input updates
 */
@Directive({
  selector: '[appIfHasStock]',
  standalone: true,
})
export class IfHasStockDirective implements OnChanges {
  @Input() appIfHasStock: number = 0;

  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appIfHasStock']) {
      const inStock = this.appIfHasStock > 0;
      if (inStock && !this.hasView) {
        // Create the embedded view (insert the template into the DOM)
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!inStock && this.hasView) {
        // Remove the view from the DOM entirely
        this.viewContainer.clear();
        this.hasView = false;
      }
    }
  }
}
