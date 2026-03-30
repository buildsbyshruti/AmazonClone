USE amazon_clone;

INSERT INTO products (id, name, category_id, price, discount, description, stock, rating, reviews_count, image_url, is_active)
VALUES
(1001, 'Fresh Farm Apples - 1 kg', 9, 159, 20, 'Premium orchard apples delivered fresh.', 120, 4.4, 318, 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=600&q=80', 1),
(1002, 'Fresh Spinach Bundle', 9, 49, 15, 'Leafy spinach ideal for salads and curries.', 200, 4.2, 92, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&q=80', 1),
(1003, 'Smartphone 5G 8GB/128GB', 10, 16999, 24, 'Fast 5G smartphone with high refresh display.', 35, 4.5, 2110, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80', 1),
(1004, 'Pro Camera Smartphone', 10, 29999, 18, 'Flagship mobile with advanced camera system.', 25, 4.6, 1408, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80', 1),
(1005, 'Noise Cancelling Earbuds', 1, 2499, 35, 'Wireless earbuds with active noise cancellation.', 80, 4.3, 678, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=600&q=80', 1),
(1006, 'Ultra HD Smart TV 43 inch', 1, 27999, 28, '4K smart TV with HDR and Dolby audio.', 18, 4.4, 843, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=600&q=80', 1),
(1007, 'Cotton Casual T-Shirt', 2, 599, 50, 'Soft cotton fit for all-day comfort.', 140, 4.2, 1209, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', 1),
(1008, 'Slim Fit Denim Jeans', 2, 1299, 42, 'Trendy slim fit jeans for all occasions.', 90, 4.1, 932, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80', 1),
(1009, 'Non-stick Cookware Set', 19, 1899, 45, 'Durable cookware set for everyday cooking.', 70, 4.1, 711, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80', 1),
(1010, 'Vacuum Flask Bottle', 19, 699, 39, 'Keeps drinks hot or cold for hours.', 110, 4.0, 502, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80', 1),
(1011, 'Kitchen Knife Set', 11, 1099, 31, 'Professional stainless steel knife combo.', 95, 4.3, 1500, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80', 1),
(1012, 'Premium Yoga Mat', 11, 899, 33, 'High-grip mat for yoga and workouts.', 60, 4.5, 640, 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=600&q=80', 1),
(1013, 'Bluetooth Neckband', 12, 1199, 60, 'Wireless neckband with long battery life.', 80, 4.2, 389, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80', 1),
(1014, 'Wireless Charging Pad', 12, 799, 48, 'Fast charging pad compatible with modern phones.', 110, 4.0, 274, 'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=600&q=80', 1),
(1015, 'New Release Smartwatch', 14, 3499, 12, 'Fitness watch with SPO2 and GPS tracking.', 45, 4.2, 167, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80', 1),
(1016, 'Mini Espresso Machine', 14, 6999, 15, 'Compact espresso machine for home baristas.', 20, 4.3, 84, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', 1),
(1017, 'Prime Video Family Pack', 15, 1499, 25, 'Annual entertainment subscription package.', 9999, 4.7, 2670, 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&q=80', 1),
(1018, 'Prime Gaming Starter Bundle', 15, 999, 20, 'Gaming bundle for Prime members.', 500, 4.4, 440, 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80', 1),
(1019, 'Merchant POS Device', 16, 2999, 10, 'POS device for merchants and small businesses.', 30, 4.1, 90, 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=600&q=80', 1),
(1020, 'Recharge & Bill Cashback Pack', 16, 399, 35, 'Utility payments and recharge cashback combo.', 1000, 4.1, 340, 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80', 1),
(1021, 'Seller Starter Packaging Kit', 17, 749, 22, 'Starter kit for new sellers.', 50, 4.0, 54, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80', 1),
(1022, 'Catalog Photography Light Box', 17, 1299, 27, 'Light box for product photography.', 40, 4.2, 71, 'https://images.unsplash.com/photo-1520333789090-1afc82db536a?w=600&q=80', 1),
(1023, 'Customer Service Headset', 13, 1599, 30, 'Headset for customer service professionals.', 60, 4.3, 124, 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&q=80', 1),
(1024, 'MX Player Streaming Stick', 18, 2199, 26, 'Streaming stick for MX Player app.', 70, 4.1, 203, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=80', 1)
ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), discount=VALUES(discount), description=VALUES(description), stock=VALUES(stock), rating=VALUES(rating), reviews_count=VALUES(reviews_count), image_url=VALUES(image_url), is_active=VALUES(is_active);