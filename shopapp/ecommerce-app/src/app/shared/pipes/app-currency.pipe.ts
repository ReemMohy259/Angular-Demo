import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe: formats a number as a currency string.
 * Usage:  {{ product.price | appCurrency }}
 *         {{ product.price | appCurrency:'EUR':'€' }}
 */
@Pipe({ name: 'appCurrency', standalone: true, pure: true })
export class AppCurrencyPipe implements PipeTransform {
  transform(value: number, currency = 'USD', symbol = '$'): string {
    if (value == null || isNaN(value)) return '-';
    const formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol}${formatted}`;
  }
}
