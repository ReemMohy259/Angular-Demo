import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./features/product-details/pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/pages/cart/cart.component').then((m) => m.CartComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
