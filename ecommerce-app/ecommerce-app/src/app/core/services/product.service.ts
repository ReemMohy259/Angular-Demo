import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with 40-hour battery life, ANC, and Hi-Res Audio certification.',
      price: 199.99,
      originalPrice: 279.99,
      discount: 29,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      category: 'Audio',
      rating: 4.7,
      stock: 15,
    },
    {
      id: 2,
      name: 'Mechanical Gaming Keyboard',
      description: 'TKL layout with Cherry MX Red switches, RGB backlighting, and aircraft-grade aluminum frame.',
      price: 129.99,
      originalPrice: 159.99,
      discount: 19,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80',
      category: 'Peripherals',
      rating: 4.5,
      stock: 30,
    },
    {
      id: 3,
      name: 'Ultrawide Curved Monitor 34"',
      description: '3440×1440 IPS panel, 144Hz, 1ms response time. HDR400 and factory calibrated color.',
      price: 549.00,
      originalPrice: 699.00,
      discount: 21,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80',
      category: 'Monitors',
      rating: 4.8,
      stock: 8,
    },
    {
      id: 4,
      name: 'Ergonomic Office Chair',
      description: 'Lumbar support, adjustable armrests, breathable mesh back. Built for long work sessions.',
      price: 349.00,
      originalPrice: 449.00,
      discount: 22,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
      category: 'Furniture',
      rating: 4.6,
      stock: 12,
    },
    {
      id: 5,
      name: 'Portable SSD 2TB',
      description: '2000 MB/s read speed, USB-C 3.2 Gen 2×2, rugged IP55 water & dust resistant enclosure.',
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80',
      category: 'Storage',
      rating: 4.9,
      stock: 25,
    },
    {
      id: 6,
      name: 'Webcam 4K Pro',
      description: 'Sony sensor, auto-focus, HDR, built-in noise-cancelling mic. Perfect for streaming and calls.',
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80',
      category: 'Peripherals',
      rating: 4.4,
      stock: 40,
    },
    {
      id: 7,
      name: 'Smart LED Desk Lamp',
      description: 'Touch-dimming, 5 color temps, USB-A charging port, memory function, eye-care certification.',
      price: 49.99,
      originalPrice: 69.99,
      discount: 29,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      category: 'Lighting',
      rating: 4.3,
      stock: 60,
    },
    {
      id: 8,
      name: 'Wireless Charging Pad (3-in-1)',
      description: 'Charge phone, earbuds, and smartwatch simultaneously. 15W fast-charge compatible.',
      price: 59.99,
      originalPrice: 79.99,
      discount: 25,
      image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80',
      category: 'Accessories',
      rating: 4.5,
      stock: 50,
    },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}
