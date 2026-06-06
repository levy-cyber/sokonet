export const appName = 'SokoNet';

export const pageMeta = {
  dashboard: 'Admin overview, fintech analytics, and marketplace health.',
  marketplace: 'Browse vibrant marketplace products from trusted suppliers.',
  profile: 'Manage your account, preferences, and billing information.',
};

export const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Escrow', path: '/escrow' },
  { label: 'Orders', path: '/orders' },
  { label: 'Shops', path: '/shops' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Wallet', path: '/wallet' },
  { label: 'Analytics', path: '/analytics' },
  { label: 'Chat', path: '/chat' },
  { label: 'Subscriptions', path: '/subscriptions' },
  { label: 'Profile', path: '/profile' },
];

export const plans = [
  { key: 'free', name: 'Free', price: 0, benefits: ['Basic listings', 'Standard support'] },
  { key: 'premium', name: 'Premium', price: 45, benefits: ['Priority escrow', 'Advanced analytics', 'Seller boost'] },
  { key: 'enterprise', name: 'Enterprise', price: 150, benefits: ['Custom integration', 'Dedicated manager', 'Unlimited listings'] },
];
