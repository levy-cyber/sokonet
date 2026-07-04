const portalRouteAccess = {
  '/shop/mine': ['seller'],
  '/services/mine': ['service_provider', 'freelancer'],
  '/bookings': ['service_provider', 'freelancer'],
  '/rider/dashboard': ['rider'],
  '/admin': ['admin'],
};

const roleHomePaths = {
  buyer: '/',
  seller: '/shop/mine',
  service_provider: '/services/mine',
  rider: '/rider/dashboard',
  freelancer: '/services/mine',
  admin: '/admin',
};

export const normalizePath = (pathname = '/') => {
  if (!pathname) return '/';
  return pathname.split('?')[0].split('#')[0];
};

export const canAccessPath = (role, pathname) => {
  const normalizedPath = normalizePath(pathname);
  const requiredRoles = portalRouteAccess[normalizedPath];

  if (!requiredRoles) {
    return true;
  }

  return requiredRoles.includes(role || 'buyer');
};

export const getRoleHomePath = (role) => roleHomePaths[role] || '/';
