const authorize = (...roles) => {
    return (req, res, next) => {
        // Make sure the user is authenticated first.
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please log in.",
            });
        }

        // Check whether the user's role is allowed.
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        next();
    };
};

module.exports = {
    authorize,
};