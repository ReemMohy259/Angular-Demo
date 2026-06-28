import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

/**
 * Resolves a single Product by :id before the route activates.
 * Redirects to /admin/products if not found.
 */
export const productResolver: ResolveFn<Product | null> =
  (route: ActivatedRouteSnapshot) => {
    const id      = Number(route.paramMap.get('id'));
    const service = inject(ProductService);
    const router  = inject(Router);

    return service.fetchProductById(id).pipe(
      map(product => {
        if (!product) { router.navigate(['/admin/products']); return null; }
        return product;
      }),
      catchError(() => {
        router.navigate(['/admin/products']);
        return of(null);
      })
    );
  };
