import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

/**
 * Resolver — productsResolver (functional resolver, Angular 14+)
 *
 * Fetches ALL products before the route component activates.
 * The router waits for this Observable to complete, then passes
 * the result via ActivatedRoute.snapshot.data['products'].
 *
 * Bonus: NavbarComponent shows a loading spinner while router is navigating
 * (detected via Router events: NavigationStart / NavigationEnd).
 */
export const productsResolver: ResolveFn<Product[]> = (): Observable<Product[]> => {
  return inject(ProductService).fetchProducts();
};
