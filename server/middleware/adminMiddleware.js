const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no user context',
      });
    }

    const userRoles = [req.user.role, ...(req.user.roles || [])].filter(Boolean);
    const isAuthorized = roles.some((role) => userRoles.includes(role));

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role || 'none'}' is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = { authorize };
