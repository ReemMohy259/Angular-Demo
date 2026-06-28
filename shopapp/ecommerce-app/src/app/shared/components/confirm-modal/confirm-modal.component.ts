import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="onCancel()">
      <div class="modal" (click)="$event.stopPropagation()">
        <h3 class="modal__title">{{ title }}</h3>
        <p class="modal__body">{{ message }}</p>
        <div class="modal__actions">
          <button class="modal__btn modal__btn--danger" (click)="onConfirm()">
            {{ confirmLabel }}
          </button>
          <button class="modal__btn modal__btn--outline" (click)="onCancel()">
            {{ cancelLabel }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex; align-items: center; justify-content: center;
      z-index: 500;
      animation: fadein .15s ease;
    }
    @keyframes fadein { from { opacity: 0 } to { opacity: 1 } }

    .modal {
      background: #fff;
      border-radius: 10px;
      padding: 28px 24px 20px;
      max-width: 380px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(0,0,0,.14);
      animation: slidein .15s ease;
    }
    @keyframes slidein { from { transform: translateY(-12px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }

    .modal__title  { font-size: 16px; font-weight: 700; margin: 0 0 8px; }
    .modal__body   { font-size: 13px; color: #555; margin: 0 0 20px; line-height: 1.6; }
    .modal__actions { display: flex; gap: 10px; }

    .modal__btn {
      flex: 1; padding: 9px 0; font-size: 13px; font-weight: 600;
      border-radius: 6px; border: none; cursor: pointer; transition: opacity .15s;
      &:hover { opacity: .85; }
    }
    .modal__btn--danger  { background: #dc2626; color: #fff; }
    .modal__btn--outline { background: #fff; color: #1a1a1a; border: 1px solid #d5d5d5; }
  `],
})
export class ConfirmModalComponent {
  @Input() title        = 'Are you sure?';
  @Input() message      = 'This action cannot be undone.';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel  = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel():  void { this.cancelled.emit(); }
}
