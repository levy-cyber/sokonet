import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import ProtectedRoute from './ProtectedRoute';

// Pages
import AuthPage from '../pages/AuthPage';
import Dashboard from '../pages/Dashboard';
import Marketplace from '../pages/Marketplace';
import ProductDetails from '../pages/ProductDetails';
import EscrowPage from '../pages/EscrowPage';
import OrdersPage from '../pages/OrdersPage';
import JobsPage from '../pages/JobsPage';
import WalletPage from '../pages/WalletPage';
import ChatPage from '../pages/ChatPage';
import AnalyticsPage from '../pages/AnalyticsPage';
import AdminPage from '../pages/AdminPage';
import RidersPage from '../pages/RidersPage';
import ShopsPage from '../pages/ShopsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/register" element={<AuthPage isLogin={false} />} />
      </Route>

      {/* Protected Main Layout routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout title="Dashboard" />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        <Route element={<MainLayout title="Marketplace Catalog" />}>
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/marketplace/product/:id" element={<ProductDetails />} />
        </Route>

        <Route element={<MainLayout title="SokoNet Escrow Accounts" />}>
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

        {/* Role: Seller Only */}
        <Route element={<ProtectedRoute allowedRoles={['seller']} />}>
          <Route element={<MainLayout title="My Vendor Storefront" />}>
            <Route path="/shop/mine" element={<ShopsPage />} />
          </Route>
        </Route>

        {/* Role: Rider Only */}
        <Route element={<ProtectedRoute allowedRoles={['rider']} />}>
          <Route element={<MainLayout title="Logistics Rider Dashboard" />}>
            <Route path="/rider/dashboard" element={<RidersPage />} />
          </Route>
        </Route>

        {/* Role: Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<MainLayout title="System Metrics & Analytics" />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>
          <Route element={<MainLayout title="Admin Management Console" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
