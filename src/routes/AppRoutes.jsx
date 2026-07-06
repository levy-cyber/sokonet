import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace';
import FoodMarketplace from '../pages/FoodMarketplace';
import ProductDetails from '../pages/ProductDetails';
import EscrowPage from '../pages/EscrowPage';
import OrdersPage from '../pages/OrdersPage';
import JobsPage from '../pages/JobsPage';
import WalletPage from '../pages/WalletPage';
import ChatPage from '../pages/ChatPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AdminPage from '../pages/AdminPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import RidersPage from '../pages/RidersPage';
import ShopsPage from '../pages/ShopsPage';
import ServicesPage from '../pages/ServicesPage';
import ServicesMarketplace from '../pages/ServicesMarketplace';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import SettingsPage from '../pages/SettingsPage';
import OTPVerificationPage from '../pages/OTPVerificationPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
      </Route>

      {/* Public auth-related routes */}
      <Route path="/verify-otp" element={<OTPVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Protected Main Layout routes - All accessible to authenticated users */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout title="Dashboard" />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<MainLayout title="Marketplace Catalog" />}>
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/product/:id" element={<ProductDetails />} />
        </Route>

        <Route element={<MainLayout title="Food & Beverage Marketplace" />}>
          <Route path="/food" element={<FoodMarketplace />} />
        </Route>

        <Route element={<MainLayout title="Services Marketplace" />}>
          <Route path="/services" element={<ServicesMarketplace />} />
        </Route>

        <Route element={<MainLayout title="Netsoko Escrow Accounts" />}>
          <Route path="/escrow" element={<EscrowPage />} />
        </Route>

        <Route element={<MainLayout title="Digital Wallet & Payouts" />}>
          <Route path="/wallet" element={<WalletPage />} />
        </Route>

        <Route element={<MainLayout title="My Orders & Shipments" />}>
          <Route path="/orders" element={<OrdersPage />} />
        </Route>

        <Route element={<MainLayout title="Jobs & Freelancing Hub" />}>
          <Route path="/jobs" element={<JobsPage />} />
        </Route>

        <Route element={<MainLayout title="Live Chats" />}>
          <Route path="/chat" element={<ChatPage />} />
        </Route>

        <Route element={<MainLayout title="Shopping Cart" />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route element={<MainLayout title="Checkout" />}>
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route element={<MainLayout title="Settings" />}>
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* Role-specific pages - Protected by role */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout title="My Vendor Storefront" />}>
          <Route path="/shop/mine" element={<ShopsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout title="Business Analytics" />}>
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout title="Logistics Rider Dashboard" />}>
          <Route path="/rider/dashboard" element={<RidersPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['service_provider', 'freelancer']} />}>
        <Route element={<MainLayout title="My Service Management" />}>
          <Route path="/services/mine" element={<ServicesPage />} />
        </Route>
        <Route element={<MainLayout title="Service Bookings" />}>
          <Route path="/bookings" element={<ServicesPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route element={<MainLayout title="Admin Management Console" />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;