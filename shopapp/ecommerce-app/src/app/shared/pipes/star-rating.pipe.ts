import { Pipe, PipeTransform } from '@angular/core';

/**
 * Custom pipe: converts a numeric rating (0-5) to a ★/☆ string.
 * Usage:  {{ product.rating | starRating }}   →  "★★★★½"
 */
@Pipe({ name: 'starRating', standalone: true, pure: true })
export class StarRatingPipe implements PipeTransform {
  transform(value: number, max = 5): string {
    if (value == null) return '';
    const full  = Math.floor(value);
    const half  = value % 1 >= 0.5 ? 1 : 0;
    const empty = max - full - half;
    return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
  }
}
