const jwt = require("jsonwebtoken");
const protect = (req, res, next) => {
    console.log("Protect middleware called");
    console.log("Headers:", req.headers);
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                message: "Not authorized. No token provided."
            });
        }

        const bearerToken = token.startsWith("Bearer ")
            ? token.split(" ")[1]
            : token;
 
        // Declare decoded ONLY ONCE
       const decoded = jwt.verify(
    bearerToken,
    process.env.JWT_SECRET
);

req.user = {
    _id: decoded.id,
    id: decoded.id,
    role: decoded.role
};

next();

    

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid token."
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized."
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied."
            });
        }

        next();
    };
};

module.exports = {
    protect,
    authorize
};