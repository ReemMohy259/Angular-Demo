-- Runs on startup (only if spring.jpa.hibernate.ddl-auto=create or create-drop)
-- With ddl-auto=update, run this manually once after first startup.

INSERT IGNORE INTO products (id, name, description, price, original_price, discount, image, category, rating, stock)
VALUES
(1, 'Wireless Noise-Cancelling Headphones', 'Premium over-ear headphones with 40-hour battery life, ANC, and Hi-Res Audio.', 199.99, 279.99, 29, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', 'Audio', 4.7, 15),
(2, 'Mechanical Gaming Keyboard', 'TKL layout, Cherry MX Red switches, RGB backlighting, aluminum frame.', 129.99, 159.99, 19, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&q=80', 'Peripherals', 4.5, 30),
(3, 'Ultrawide Curved Monitor 34"', '3440x1440 IPS, 144Hz, 1ms, HDR400.', 549.00, 699.00, 21, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&q=80', 'Monitors', 4.8, 8),
(4, 'Ergonomic Office Chair', 'Lumbar support, adjustable armrests, breathable mesh back.', 349.00, 449.00, 22, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80', 'Furniture', 4.6, 12),
(5, 'Portable SSD 2TB', '2000 MB/s read, USB-C 3.2 Gen 2x2, IP55 resistant.', 159.99, 199.99, 20, 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=400&q=80', 'Storage', 4.9, 25),
(6, 'Webcam 4K Pro', 'Sony sensor, auto-focus, HDR, noise-cancelling mic.', 89.99, 119.99, 25, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&q=80', 'Peripherals', 4.4, 40),
(7, 'Smart LED Desk Lamp', 'Touch-dimming, 5 color temps, USB-A charging, eye-care cert.', 49.99, 69.99, 29, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Lighting', 4.3, 60),
(8, 'Wireless Charging Pad (3-in-1)', 'Charge phone, earbuds, and smartwatch simultaneously. 15W fast-charge.', 59.99, 79.99, 25, 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80', 'Accessories', 4.5, 50);
