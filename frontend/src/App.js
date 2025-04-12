// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BentoHeader from './components/layout/BentoHeader';
import BentoFooter from './components/layout/BentoFooter';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ProfilePage from './pages/ProfilePage';

// Subscription Pages
import MySubscriptionsPage from './pages/subscription/MySubscriptionsPage';
import CreateSubscriptionPage from './pages/subscription/CreateSubscriptionPage';
import SubscriptionDetailPage from './pages/subscription/SubscriptionDetailPage';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import OrdersListPage from './pages/admin/OrdersListPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductEditPage from './pages/admin/ProductEditPage'; // We'll create this later
import ProductCreatePage from './pages/admin/ProductCreatePage'; // We'll create this later

import './App.css';

function App() {
  return (
    <Router>
      <BentoHeader />
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/shipping" element={<ProtectedRoute><ShippingPage /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/placeorder" element={<ProtectedRoute><PlaceOrderPage /></ProtectedRoute>} />
          <Route path="/order/:id" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
          <Route path="/myorders" element={<ProtectedRoute><MyOrdersPage /></ProtectedRoute>} />

          {/* Subscription Routes */}
          <Route path="/subscriptions" element={<ProtectedRoute><MySubscriptionsPage /></ProtectedRoute>} />
          <Route path="/subscriptions/create" element={<ProtectedRoute><CreateSubscriptionPage /></ProtectedRoute>} />
          <Route path="/subscriptions/:id" element={<ProtectedRoute><SubscriptionDetailPage /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrdersListPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductsListPage /></AdminRoute>} />
          <Route path="/admin/products/create" element={<AdminRoute><ProductCreatePage /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><ProductEditPage /></AdminRoute>} />

          {/* Redirects */}
          <Route path="/orders" element={<Navigate to="/myorders" replace />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Catch-all route - 404 */}
          <Route path="*" element={
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
              <p className="mb-4">The page you are looking for does not exist.</p>
              <a href="/" className="text-green-600 hover:underline">Go back to home</a>
            </div>
          } />
        </Routes>
      </main>
      <BentoFooter />

      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  );
}

export default App;