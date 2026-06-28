import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="spinner-wrap" [style.minHeight]="minHeight">
      <div class="spinner"></div>
      <p class="spinner-msg">{{ message }}</p>
    </div>
  `,
  styles: [`
    .spinner-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid #e5e5e5;
      border-top-color: #1a1a1a;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner-msg { font-size: 13px; color: #888; }
  `],
})
export class LoadingSpinnerComponent {
  @Input() message = 'Loading…';
  @Input() minHeight = '200px';
}
