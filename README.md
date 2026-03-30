# Amazon Clone – Full-Stack E-Commerce Application

A fully functional Amazon-inspired e-commerce application built with React (Vite) on the frontend and Node.js/Express with MySQL on the backend.

## 🖥️ Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React 19, Vite, React Router v7, Axios |
| Backend    | Node.js, Express 5                   |
| Database   | MySQL 8                             |
| Styling    | Vanilla CSS (Amazon-inspired design) |

## 📋 Features

### Core Features
- **Product Listing** – Grid layout with image, name, price, discount, ratings, and Add to Cart button
- **Search & Filter** – Search by product name; filter by category via navigation bar
- **Product Detail Page** – Image carousel, specifications, price with MRP/discount, stock status, offers section, customer reviews
- **Shopping Cart** – Add/remove items, update quantities, cart summary with subtotal
- **Checkout** – Multi-step: Shipping address → Payment method → Order review
- **Order Confirmation** – Displays order ID, shipping address, and ordered items

### Bonus Features
- **Responsive Design** – Works across mobile, tablet, and desktop
- **User Authentication** – Login/Signup with session persistence via localStorage
- **Order History** – View past orders with status and total
- **Wishlist** – Add/remove products, move to cart
- **Guest Cart & Wishlist** – Works without login using localStorage; syncs on login
- **Inline Error Messages** – No flash/toast popups; errors shown inline next to each action

## 🏗️ Database Schema

```
users           → id, name, email, password
categories      → id, name, category_key, image_url
products        → id, name, category_id, price, discount, description, image_url, stock, rating, reviews_count
product_images  → id, product_id, image_url, is_primary, sort_order
product_specs   → id, product_id, spec_key, spec_value
cart_items      → id, user_id, product_id, quantity
wishlist        → id, user_id, product_id
addresses       → id, user_id, full_name, phone, line1, line2, city, state, pincode, country
orders          → id, user_id, address_id, total_amount, status
order_items     → id, order_id, product_id, product_name, quantity, price, image_url
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MySQL 8
- npm

### 1. Database Setup
```bash
# Log into MySQL
mysql -u root -p

# Run schema and seed
source backend/sql/schema.sql;
source backend/sql/seed.sql;
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env         # Edit with your DB credentials
npm install
npm run dev                  # Runs on http://localhost:8000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev                  # Runs on http://localhost:5173
```

## 📁 Project Structure
```
amazon-clone/
├── backend/
│   ├── server.js            # Express API server
│   ├── sql/
│   │   ├── schema.sql       # Database schema (10 tables)
│   │   └── seed.sql         # Sample data (13 products, 10 categories)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, ProductCard, ProductGrid, Banner, etc.
│   │   ├── pages/           # HomePage, ProductDetailPage, CartPage, CheckoutPage, etc.
│   │   ├── context/         # AuthContext
│   │   ├── services/        # API client (Axios)
│   │   ├── utils/           # localStorage cart/wishlist, image fallback
│   │   ├── data/            # Mock catalog for offline fallback
│   │   └── styles/          # Component-level CSS files
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | /api/register            | Create new user account        |
| POST   | /api/login               | User login                     |
| GET    | /api/products            | List all products              |
| GET    | /api/products/:id        | Product detail + images + specs|
| GET    | /api/categories          | List categories                |
| GET    | /api/cart                | Get user's cart                |
| POST   | /api/cart/items          | Add item to cart               |
| PUT    | /api/cart/items/:id      | Update cart item quantity       |
| DELETE | /api/cart/items/:id      | Remove item from cart          |
| GET    | /api/wishlist            | Get user's wishlist            |
| POST   | /api/wishlist/items      | Add to wishlist                |
| DELETE | /api/wishlist/items/:pid | Remove from wishlist           |
| POST   | /api/orders              | Place order (saves address)    |
| GET    | /api/orders              | List user's orders             |
| GET    | /api/orders/:id          | Order detail + items + address |

## 📝 Assumptions

1. **Password Storage** – Passwords are stored in plain text for simplicity. In production, use bcrypt.
2. **Payment** – Payment processing is simulated (no real payment gateway integration).
4. **Guest Mode** – Cart and wishlist work via localStorage for non-logged-in users. Checkout requires login.
4. **Images** – Product images are sourced from Unsplash for demonstration purposes.
