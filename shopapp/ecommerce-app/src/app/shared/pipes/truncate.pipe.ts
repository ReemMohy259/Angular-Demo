import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe: truncates a string to a maximum length and appends ellipsis.
 * Usage:  {{ product.description | truncate:80 }}
 *         {{ product.description | truncate:80:'…' }}
 */
@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100, trail = '...'): string {
    if (!value) return '';
    return value.length > limit ? value.substring(0, limit).trimEnd() + trail : value;
  }
}
