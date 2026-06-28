import { Routes } from '@angular/router';
import { productsResolver } from './core/resolvers/products.resolver';
import { productDetailResolver } from './core/resolvers/product-detail.resolver';

export const routes: Routes = [
  // ── Public shop routes ────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then(m => m.HomeComponent),
    resolve: { products: productsResolver },
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/pages/product-details/product-details.component')
        .then(m => m.ProductDetailsComponent),
    resolve: { product: productDetailResolver },
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/pages/cart/cart.component').then(m => m.CartComponent),
  },

  // ── Admin routes ──────────────────────────────────────────────────────────
  {
    path: 'admin',
    children: [
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/pages/product-list/admin-product-list.component')
            .then(m => m.AdminProductListComponent),
        resolve: { products: productsResolver },
      },
      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/admin/pages/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./features/admin/pages/product-detail/admin-product-detail.component')
            .then(m => m.AdminProductDetailComponent),
        resolve: { product: productDetailResolver },
      },
      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/admin/pages/product-form/product-form.component')
            .then(m => m.ProductFormComponent),
        resolve: { product: productDetailResolver },
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full',
      },
    ],
  },

  // ── Wildcard ──────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '',
  },
];
