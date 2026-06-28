import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validators — used in the Reactive Form (lab4)
 *
 * These are plain functions that receive an AbstractControl and
 * return null (valid) or a ValidationErrors object (invalid).
 */

/** Price must be > 0 */
export function positivePrice(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    if (isNaN(value) || value <= 0) {
      return { positivePrice: { actual: control.value } };
    }
    return null;
  };
}

/**
 * Sale price must be less than or equal to original price.
 * Applied as a cross-field validator on the FormGroup.
 */
export function salePriceLessThanOriginal(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const price    = Number(group.get('price')?.value);
    const original = Number(group.get('originalPrice')?.value);
    if (original > 0 && price > original) {
      return { salePriceTooHigh: { price, original } };
    }
    return null;
  };
}

/** Rating must be between 0 and 5 */
export function ratingRange(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = Number(control.value);
    if (isNaN(value) || value < 0 || value > 5) {
      return { ratingRange: { actual: control.value } };
    }
    return null;
  };
}

/** URL must start with http:// or https:// (or be empty) */
export function urlFormat(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    if (value === '') return null; // optional field
    const valid = /^https?:\/\/.+/.test(value);
    return valid ? null : { urlFormat: { actual: value } };
  };
}
