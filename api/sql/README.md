# Database Setup Guide

This project uses MySQL with a normalized e-commerce schema.

## 1. Create schema

Run:

```sql
source /absolute/path/to/backend/sql/schema.sql;
```

## 2. Seed sample data

Run:

```sql
source /absolute/path/to/backend/sql/seed.sql;
```

## 3. Verify quick checks

```sql
USE amazon_clone;
SELECT COUNT(*) AS products_count FROM products;
SELECT COUNT(*) AS categories_count FROM categories;
SELECT COUNT(*) AS images_count FROM product_images;
```

## 4. Backend environment

Keep DB config in backend/.env and do not hardcode credentials in code.
The backend reads these values automatically:

DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
PORT

Example start commands:

```bash
cd /absolute/path/to/backend
npm run dev
```

## Notes

- Product listing images are read from product_images where is_primary = 1.
- Product detail image carousel uses all images from product_images.
- Cart, checkout, and orders are stored in carts/cart_items and orders/order_items.
- The app assumes a default user id = 1 (no login required).
