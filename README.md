# ShopApp — Angular + Spring Boot Ecommerce

A full-stack shopping application built as a university assignment across two labs.

---

## Project Structure

```
shopapp/
├── ecommerce-app/          ← Angular 17 frontend
└── shopapp-backend/        ← Spring Boot 3 backend
```

---

## Lab 1 vs Lab 2 (Git branches)

| Branch | Description |
|--------|-------------|
| `master` | Lab 1 — static data, `@Input`/`@Output` decorators, `BehaviorSubject` in services |
| `lab2`   | Lab 2 — Angular **Signals** (`input()`, `output()`, `computed()`), `HttpClient` connected to Spring Boot REST API |

```bash
git checkout master   # lab 1
git checkout lab2     # lab 2
```

---

## Frontend — Angular 17

### Key Concepts Used

#### Lab 1 (master branch)
- `@Input()` / `@Output()` decorators for component communication
- `BehaviorSubject` in `CartService` for reactive state
- Static product array in `ProductService`
- Standalone components (no NgModule)

#### Lab 2 (lab2 branch)
- **Signal inputs** — `input.required<T>()` / `input<T>(defaultValue)`
- **Signal outputs** — `output<T>()` (replaces `new EventEmitter`)
- **Computed signals** — `computed(() => ...)` for derived values (totals, cart count)
- **Service signals** — `signal<T>()` instead of `BehaviorSubject` in both services
- **`inject()`** — functional injection replacing constructor injection
- **`HttpClient`** — `ProductService.loadProducts()` calls `GET /api/products`; falls back to static data if API is offline
- Loading and error states shown in the UI

### Folder Structure

```
src/app/
├── core/
│   ├── models/
│   │   ├── product.model.ts        ← Product interface
│   │   └── cart-item.model.ts      ← CartItem interface
│   └── services/
│       ├── product.service.ts      ← Signal state + HttpClient GET
│       └── cart.service.ts         ← Signal state + computed totals
├── shared/
│   └── components/navbar/          ← Sticky nav, live cart badge from signal
└── features/
    ├── home/
    │   ├── components/
    │   │   ├── product-card/       ← input() product, isInCart; output() addToCart
    │   │   └── product-list/       ← loops cards, passes data down/up
    │   └── pages/home/
    ├── product-details/
    │   └── pages/product-details/  ← reads :id param, shows full product info
    └── cart/
        ├── components/
        │   ├── cart-item/          ← input() item; computed() itemTotal; output() qty/remove
        │   └── cart-summary/       ← input() totals; computed() discountPercent; output() checkout
        └── pages/cart/
```

### Routes

| URL | Component |
|-----|-----------|
| `/` | `HomeComponent` — product grid |
| `/product/:id` | `ProductDetailsComponent` — full product details |
| `/cart` | `CartComponent` — cart items + summary + grand total |

### Cart Features
- Each cart item shows: image, name, category, unit price, original price, discount %
- **Quantity** displayed as text (textbox in future lab)
- **Item total** = price × quantity (shown per row)
- **Grand total** section: subtotal before discount, discount amount, total after discount, savings

### Run

```bash
cd ecommerce-app
npm install
ng serve
# → http://localhost:4200
```

---

## Backend — Spring Boot 3 + MySQL

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Spring Boot 3.2 |
| Language | Java 17 |
| ORM | Spring Data JPA (Hibernate) |
| Database | MySQL 8 |
| Boilerplate | Lombok |

### API Endpoints

#### Products — `GET /api/products`

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | All products |
| GET | `/api/products?category=Audio` | Filter by category |
| GET | `/api/products?search=keyboard` | Search by name |
| GET | `/api/products/{id}` | Single product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

#### Cart — `GET /api/cart` (session via `X-Session-Id` header)

| Method | URL | Body | Description |
|--------|-----|------|-------------|
| GET | `/api/cart` | — | Get all cart items |
| POST | `/api/cart/add` | `{ "productId": 3 }` | Add item |
| PUT | `/api/cart/update` | `{ "productId": 3, "quantity": 5 }` | Update quantity |
| DELETE | `/api/cart/remove/{productId}` | — | Remove item |
| DELETE | `/api/cart/clear` | — | Empty cart |
| GET | `/api/cart/totals` | — | Get price totals |

### Database Schema

```sql
CREATE TABLE products (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    name           VARCHAR(255) NOT NULL,
    description    TEXT,
    price          DOUBLE NOT NULL,
    original_price DOUBLE NOT NULL,
    discount       INT,
    image          VARCHAR(500),
    category       VARCHAR(100),
    rating         DOUBLE,
    stock          INT
);

CREATE TABLE cart_items (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(100) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity   INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

### Setup & Run

#### Prerequisites
- Java 17+
- MySQL 8 running locally
- Maven

#### Steps

```bash
# 1. Create the database
mysql -u root -p
CREATE DATABASE shopapp_db;
EXIT;

# 2. Configure credentials
# Edit: shopapp-backend/src/main/resources/application.properties
spring.datasource.username=root
spring.datasource.password=your_password_here

# 3. Persist some data in the database
open mysql and run data.sql script, found in backend/resources

# 4. Run
cd shopapp-backend
./mvnw spring-boot:run
# → http://localhost:8080

# 5. Seed data (first run only)
mysql -u root -p shopapp_db < src/main/resources/data.sql
```

#### CORS
The backend allows requests from `http://localhost:4200` (Angular dev server).
Configured in `CorsConfig.java`.

---

## How the Frontend Connects to the Backend

```
Angular (port 4200)                Spring Boot (port 8080)
─────────────────────              ─────────────────────────
ProductService.loadProducts()  →   GET /api/products
                               ←   Product[]  (JSON)

CartService.addToCart()        →   POST /api/cart/add
CartService.updateQuantity()   →   PUT  /api/cart/update
CartService.removeFromCart()   →   DELETE /api/cart/remove/{id}
CartService.clearCart()        →   DELETE /api/cart/clear
```

> **Note:** In Lab 2 the cart HTTP calls are commented out with `// HTTP: ...` markers.
> The cart still works via signals (client-side state). Uncommenting those lines
> connects the cart to the database.

---

## Signal vs BehaviorSubject — Quick Comparison

```typescript
// Lab 1 — BehaviorSubject
private cartSubject = new BehaviorSubject<CartItem[]>([]);
cart$ = this.cartSubject.asObservable();
// template: *ngIf="(cart$ | async)?.length"

// Lab 2 — Signal
readonly cartItems = signal<CartItem[]>([]);
readonly cartCount = computed(() => this.cartItems().reduce(...));
// template: @if (cartService.cartCount() > 0)
```

Signals are synchronous, require no `async` pipe, and automatically re-render
only the components that read them — making them simpler and more performant
for local UI state.
