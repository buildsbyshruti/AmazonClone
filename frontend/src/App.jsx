import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import InfoPage from "./pages/InfoPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HelpPage from "./pages/HelpPage";
import PaymentStatusPage from "./pages/PaymentStatusPage";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";

import { getCart } from "./services/api";
import {
  localGetCart,
  localUpdateCartItem,
  localRemoveCartItem,
} from "./utils/localCart";

function App() {
  const { user, logout, isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [cart, setCart] = useState({ items: [], summary: {} });

  const refreshCart = useCallback(async () => {
    try {
      if (isAuthenticated) {
        const cartData = await getCart();
        setCart(cartData);
        setCartCount(cartData?.summary?.item_count || 0);
      } else {
        const localData = localGetCart();
        setCart(localData);
        setCartCount(localData?.summary?.item_count || 0);
      }
    } catch (err) {
      console.log("Cart error:", err);

      const localData = localGetCart();
      setCart(localData);
      setCartCount(localData?.summary?.item_count || 0);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleUpdateCartQty = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        await import("./services/api").then((api) =>
          api.updateCartItem(itemId, quantity),
        );
      } else {
        localUpdateCartItem(itemId, quantity);
      }
      refreshCart();
    } catch (err) {
      console.error("Failed to update cart item.", err);
    }
  };

  const handleRemoveCartItem = async (itemId) => {
    try {
      if (isAuthenticated) {
        await import("./services/api").then((api) => api.removeCartItem(itemId));
      } else {
        localRemoveCartItem(itemId);
      }
      refreshCart();
    } catch (err) {
      console.error("Failed to remove cart item.", err);
    }
  };

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        cartCount={cartCount}
        cart={cart}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveCartItem={handleRemoveCartItem}
        user={user}
        onLogout={logout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              onCartUpdated={refreshCart}
            />
          }
        />

        <Route
          path="/product/:productId"
          element={<ProductDetailPage onCartUpdated={refreshCart} />}
        />

        <Route
          path="/cart"
          element={<CartPage onCartUpdated={refreshCart} />}
        />

        <Route
          path="/checkout"
          element={<CheckoutPage onCartUpdated={refreshCart} />}
        />
        <Route path="/payment-success/:orderId" element={<PaymentStatusPage />} />
        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmationPage />}
        />

        <Route
          path="/category/:categoryKey"
          element={<CategoryPage onCartUpdated={refreshCart} />}
        />

        <Route
          path="/search"
          element={<SearchPage onCartUpdated={refreshCart} />}
        />

        <Route
          path="/wishlist"
          element={<WishlistPage onCartUpdated={refreshCart} />}
        />

        <Route path="/orders" element={<OrderHistoryPage onCartUpdated={refreshCart} />} />

        <Route
          path="/order-confirmation/:orderId"
          element={<OrderConfirmationPage />}
        />

        <Route
          path="/privacy"
          element={
            <InfoPage
              title="Privacy Notice"
              description="This page explains how account information, order history, and user preferences are handled."
            />
          }
        />

        <Route
          path="/terms"
          element={
            <InfoPage
              title="Conditions of Use"
              description="These terms describe acceptable usage and purchase behavior."
            />
          }
        />

        <Route
          path="/returns"
          element={
            <InfoPage
              title="Returns Centre"
              description="Track and manage return requests."
            />
          }
        />

        <Route
          path="/help"
          element={<HelpPage />}
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="*"
          element={
            <InfoPage
              title="Page Under Construction"
              description="This page is currently being prepared."
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
