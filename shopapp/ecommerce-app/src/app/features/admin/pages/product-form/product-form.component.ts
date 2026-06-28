import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import {
  positivePrice,
  salePriceLessThanOriginal,
  ratingRange,
  urlFormat,
} from '../../../../core/validators/product.validators';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent implements OnInit {
  private fb             = inject(FormBuilder);
  // expose route publicly so the template can read snapshot.data
  route                  = inject(ActivatedRoute);
  private router         = inject(Router);
  private productService = inject(ProductService);

  // ── State signals ─────────────────────────────────────────────────────────
  isEditMode = signal(false);
  saving     = signal(false);
  saved      = signal(false);
  submitted  = signal(false);

  // ── Reactive Form ─────────────────────────────────────────────────────────
  form: FormGroup = this.fb.group(
    {
      name:          ['', [Validators.required, Validators.minLength(3)]],
      description:   [''],
      category:      ['', Validators.required],
      price:         [0,  [Validators.required, positivePrice()]],
      originalPrice: [0,  [positivePrice()]],
      discount:      [0,  [Validators.min(0), Validators.max(100)]],
      stock:         [0,  [Validators.required, Validators.min(0)]],
      rating:        [5,  [Validators.required, ratingRange()]],
      image:         ['', [urlFormat()]],
    },
    { validators: salePriceLessThanOriginal() }
  );

  readonly categories = [
    'Audio', 'Peripherals', 'Monitors',
    'Furniture', 'Storage', 'Lighting', 'Accessories',
  ];

  // ── Computed ──────────────────────────────────────────────────────────────
  readonly savingsPreview = computed(() => {
    const price    = Number(this.form.get('price')?.value ?? 0);
    const original = Number(this.form.get('originalPrice')?.value ?? 0);
    return Math.max(0, original - price);
  });

  readonly imagePreview = computed(() => this.form.get('image')?.value ?? '');

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Edit Product' : 'Add New Product'
  );

  readonly submitLabel = computed(() => {
    if (this.saving()) return 'Saving…';
    return this.isEditMode() ? 'Update Product' : 'Create Product';
  });

  // ── Control access helpers ────────────────────────────────────────────────
  get f() { return this.form.controls; }

  isInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl?.invalid && (ctrl.touched || this.submitted()));
  }

  errorFor(name: string): string {
    const ctrl = this.form.get(name);
    if (!ctrl?.errors) return '';
    if (ctrl.errors['required'])      return 'This field is required.';
    if (ctrl.errors['minlength'])     return `Minimum ${ctrl.errors['minlength'].requiredLength} characters.`;
    if (ctrl.errors['positivePrice']) return 'Price must be greater than 0.';
    if (ctrl.errors['ratingRange'])   return 'Rating must be between 0 and 5.';
    if (ctrl.errors['urlFormat'])     return 'Must be a valid URL (http:// or https://).';
    if (ctrl.errors['min'])           return 'Value cannot be negative.';
    if (ctrl.errors['max'])           return 'Value cannot exceed 100.';
    return 'Invalid value.';
  }

  countErrors(): number {
    return Object.keys(this.form.controls).filter(k => this.form.get(k)?.invalid).length;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    const resolved = this.route.snapshot.data['product'] as Product | undefined;
    if (resolved) {
      this.isEditMode.set(true);
      this.form.patchValue(resolved);
    }

    // Auto-compute discount when price/originalPrice change
    this.form.get('price')?.valueChanges.subscribe(() => this.autoDiscount());
    this.form.get('originalPrice')?.valueChanges.subscribe(() => this.autoDiscount());
  }

  private autoDiscount(): void {
    const orig = Number(this.form.get('originalPrice')?.value ?? 0);
    const curr = Number(this.form.get('price')?.value ?? 0);
    if (orig > 0 && curr > 0 && orig >= curr) {
      const disc = Math.round(((orig - curr) / orig) * 100);
      this.form.get('discount')?.patchValue(disc, { emitEvent: false });
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  submit(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.saving.set(true);
    const value = this.form.value as Partial<Product>;
    const id    = this.route.snapshot.data['product']?.id as number | undefined;

    const obs = this.isEditMode() && id
      ? this.productService.updateProduct(id, value)
      : this.productService.createProduct(value);

    obs.subscribe({
      next: (savedProduct) => {
        this.saving.set(false);
        this.saved.set(true);
        setTimeout(() => this.router.navigate(['/admin/products', savedProduct.id]), 1200);
      },
      error: () => this.saving.set(false),
    });
  }
}
