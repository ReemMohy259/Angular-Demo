import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

/**
 * Custom Attribute Directive — HighlightDirective
 *
 * Usage:  <tr appHighlight highlightColor="#fff8e1">
 *
 * Demonstrates:
 *  - Attribute directive with @Input
 *  - @HostListener for DOM events
 *  - ElementRef + Renderer2 for safe DOM manipulation
 */
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input() highlightColor: string = '#f0f9ff';
  @Input() defaultColor:   string = 'transparent';

  private originalBg = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    this.originalBg = this.el.nativeElement.style.backgroundColor || this.defaultColor;
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.highlightColor);
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.2s ease');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', this.originalBg);
  }
}
