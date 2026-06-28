import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {

  readonly products   = signal<Product[]>([]);
  readonly loading    = signal<boolean>(false);
  readonly error      = signal<string | null>(null);

  readonly categories = computed(() =>
    [...new Set(this.products().map(p => p.category))].sort()
  );

  private readonly apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  // ── Used by resolvers (return Observable) ────────────────────────────────

  fetchProducts(): Observable<Product[]> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap(data => { this.products.set(data); this.loading.set(false); }),
      catchError(err => {
        console.error(err);
        this.error.set('Could not load products.');
        this.loading.set(false);
        const fallback = this.staticProducts();
        this.products.set(fallback);
        return of(fallback);
      })
    );
  }

  fetchProductById(id: number): Observable<Product | undefined> {
    const cached = this.products().find(p => p.id === id);
    if (cached) return of(cached);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(this.staticProducts().find(p => p.id === id)))
    );
  }

  // ── Imperative helper ────────────────────────────────────────────────────

  loadProducts(): void { this.fetchProducts().subscribe(); }

  getProductById(id: number): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  // ── Admin CRUD ────────────────────────────────────────────────────────────

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap(created => this.products.update(list => [...list, created])),
      catchError(() => {
        const created = { ...product, id: Date.now() } as Product;
        this.products.update(list => [...list, created]);
        return of(created);
      })
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap(updated => this.products.update(list => list.map(p => p.id === id ? updated : p))),
      catchError(() => {
        const updated = { ...product, id } as Product;
        this.products.update(list => list.map(p => p.id === id ? updated : p));
        return of(updated);
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.products.update(list => list.filter(p => p.id !== id))),
      catchError(() => {
        this.products.update(list => list.filter(p => p.id !== id));
        return of(undefined);
      })
    );
  }

  // ── Static fallback ───────────────────────────────────────────────────────
  private staticProducts(): Product[] {
    return [
      { id: 1, name: 'Wireless Noise-Cancelling Headphones', description: 'Premium over-ear headphones with 40-hour battery life, ANC, and Hi-Res Audio.', price: 199.99, originalPrice: 279.99, discount: 29, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', category: 'Audio', rating: 4.7, stock: 15 },
      { id: 2, name: 'Mechanical Gaming Keyboard', description: 'TKL layout, Cherry MX Red switches, RGB backlighting, aluminum frame.', price: 129.99, originalPrice: 159.99, discount: 19, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80', category: 'Peripherals', rating: 4.5, stock: 30 },
      { id: 3, name: 'Ultrawide Curved Monitor 34"', description: '3440×1440 IPS, 144Hz, 1ms, HDR400.', price: 549.00, originalPrice: 699.00, discount: 21, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80', category: 'Monitors', rating: 4.8, stock: 8 },
      { id: 4, name: 'Ergonomic Office Chair', description: 'Lumbar support, adjustable armrests, breathable mesh back.', price: 349.00, originalPrice: 449.00, discount: 22, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', category: 'Furniture', rating: 4.6, stock: 12 },
      { id: 5, name: 'Portable SSD 2TB', description: '2000 MB/s read, USB-C 3.2 Gen 2×2, IP55 resistant.', price: 159.99, originalPrice: 199.99, discount: 20, image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80', category: 'Storage', rating: 4.9, stock: 25 },
      { id: 6, name: 'Webcam 4K Pro', description: 'Sony sensor, auto-focus, HDR, noise-cancelling mic.', price: 89.99, originalPrice: 119.99, discount: 25, image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80', category: 'Peripherals', rating: 4.4, stock: 40 },
      { id: 7, name: 'Smart LED Desk Lamp', description: 'Touch-dimming, 5 color temps, USB-A charging, eye-care cert.', price: 49.99, originalPrice: 69.99, discount: 29, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', category: 'Lighting', rating: 4.3, stock: 60 },
      { id: 8, name: 'Wireless Charging Pad (3-in-1)', description: 'Charge phone, earbuds, and smartwatch simultaneously. 15W fast-charge.', price: 59.99, originalPrice: 79.99, discount: 25, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80', category: 'Accessories', rating: 4.5, stock: 50 },
    ];
  }
}
