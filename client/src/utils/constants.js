export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CATEGORIES = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'books', name: 'Books' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'toys', name: 'Toys & Games' },
];

export const USER_ROLES = {
  BUYER: 'buyer',
  SELLER: 'seller',
  RIDER: 'rider',
  ADMIN: 'admin',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const ESCROW_STATUS = {
  HELD: 'held',
  RELEASED: 'released',
  REFUNDED: 'refunded',
};

export const TRANSACTION_TYPES = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  PAYMENT: 'payment',
  REFUND: 'refund',
  TRANSFER: 'transfer',
};

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
};

export const JOB_CATEGORIES = [
  'technology',
  'design',
  'marketing',
  'writing',
  'customer-service',
  'finance',
  'healthcare',
  'education',
];

export const DELIVERY_STATUS = {
  PENDING: 'pending',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    features: ['Browse products', 'Basic wallet', 'Standard delivery'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 500,
    features: ['All Basic features', 'Priority support', 'Free delivery', 'Escrow protection'],
  },
  {
    id: 'business',
    name: 'Business',
    price: 2000,
    features: ['All Premium features', 'Bulk orders', 'Analytics dashboard', 'API access'],
  },
];
