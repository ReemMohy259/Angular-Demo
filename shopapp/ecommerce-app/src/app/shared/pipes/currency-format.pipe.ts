import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom Pipe — CurrencyFormatPipe
 *
 * Usage:  {{ product.price | currencyFormat }}
 *         {{ product.price | currencyFormat:'EUR':'€' }}
 *
 * Demonstrates: custom pipe with parameters, locale-aware formatting.
 */
@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: true,          // pure = only re-runs when the value reference changes
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD', symbol: string = '$'): string {
    if (value == null || isNaN(value)) return `${symbol}0.00`;
    return `${symbol}${value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
}
