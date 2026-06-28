import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

/**
 * Attribute directive: auto-focuses the host input when the view initialises.
 * Demonstrates direct DOM manipulation via ElementRef.nativeElement.
 *
 * Usage:  <input appAutoFocus />
 *         <input [appAutoFocus]="isEditMode" />   (conditional)
 */
@Directive({ selector: '[appAutoFocus]', standalone: true })
export class AutoFocusDirective implements AfterViewInit {
  @Input('appAutoFocus') enabled: boolean | string = true;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    const active = this.enabled === '' || this.enabled === true;
    if (active) {
      // Use setTimeout to push past change-detection cycle
      setTimeout(() => this.el.nativeElement.focus(), 0);
    }
  }
}
