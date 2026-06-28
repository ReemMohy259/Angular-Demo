import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

/**
 * Resolver — productDetailResolver
 *
 * Fetches ONE product by id before the detail/edit route activates.
 * If the product is already in the service signal cache, returns it immediately (of()).
 * Otherwise makes an HTTP call.
 */
export const productDetailResolver: ResolveFn<Product | undefined> = (
  route: ActivatedRouteSnapshot
): Observable<Product | undefined> => {
  const id = Number(route.paramMap.get('id'));
  return inject(ProductService).fetchProductById(id);
};
