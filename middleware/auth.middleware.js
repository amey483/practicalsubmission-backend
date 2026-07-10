import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

// Middleware to verify JWT and protect routes
const protect = async (req, res, next) => {

    console.log("Cookies =>", req.cookies);

    let token = req.cookies.jwt;

    console.log("Token =>", token);

    if (!token) {
        return res.status(401).json({
            message: "Not authorized, no token provided."
        });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded =>", decoded);

        const user = await User.findById(decoded.id).select("-password");

        console.log("User =>", user);

        req.user = user;

        next();

    } catch (err) {

        console.log(err);

        res.status(401).json({
            message: "Token failed"
        });

    }

};

// Middleware for Role-Based Access Control (RBAC)
// Usage: restrictTo('Teacher') or restrictTo('Student')
const restrictTo = (role) => {
    return (req, res, next) => {
        // The user object is guaranteed to be on req.user 
        // because this middleware runs *after* the 'protect' middleware.
        if (req.user.role !== role) {
            return res.status(403).json({
                message: `Forbidden: Only ${role}s are allowed to access this route.`
            });
        }
        next();
    };
};


export {
    protect,
    restrictTo
};