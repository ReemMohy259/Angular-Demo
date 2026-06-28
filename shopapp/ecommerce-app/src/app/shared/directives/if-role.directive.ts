import {
  Directive, Input, TemplateRef, ViewContainerRef, OnChanges,
} from '@angular/core';

/**
 * Custom STRUCTURAL directive: conditionally renders content based on a role/flag.
 * Mirrors *ngIf but adds an explicit else-template slot for educational clarity.
 *
 * Usage:
 *   <div *appIfRole="isAdmin">Admin only</div>
 *   <div *appIfRole="isAdmin; else guestTpl">Admin content</div>
 *   <ng-template #guestTpl><p>Guest content</p></ng-template>
 *
 * How it works:
 *   The micro-syntax *appIfRole="expr" desugars to:
 *     [appIfRole]="expr" [appIfRoleElse]="templateRef"
 */
@Directive({ selector: '[appIfRole]', standalone: true })
export class IfRoleDirective implements OnChanges {
  @Input() appIfRole: boolean = false;
  @Input() appIfRoleElse: TemplateRef<unknown> | null = null;

  private rendered = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnChanges(): void {
    if (this.appIfRole) {
      if (!this.rendered) {
        this.viewContainer.clear();
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.rendered = true;
      }
    } else {
      this.viewContainer.clear();
      this.rendered = false;
      if (this.appIfRoleElse) {
        this.viewContainer.createEmbeddedView(this.appIfRoleElse);
      }
    }
  }
}
