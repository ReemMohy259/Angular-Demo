import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Pipe — StockStatusPipe
 *
 * Usage:  {{ product.stock | stockStatus }}
 *
 * Returns a human-readable stock label based on quantity.
 */
@Pipe({
  name: 'stockStatus',
  standalone: true,
  pure: true,
})
export class StockStatusPipe implements PipeTransform {
  transform(stock: number): string {
    if (stock === 0)    return 'Out of stock';
    if (stock <= 5)     return `Low stock (${stock} left)`;
    if (stock <= 20)    return `In stock (${stock} units)`;
    return `In stock`;
  }
}
