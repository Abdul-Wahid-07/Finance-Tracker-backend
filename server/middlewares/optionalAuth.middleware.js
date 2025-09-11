// middlewares/optionalAuth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const optionalAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // no token, continue as normal user
        return next();
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (user) {
            req.user = user; // logged-in user
        }
    } catch (err) {
        // invalid token, just ignore, continue as normal user
    }
    next();
};

export default optionalAuthMiddleware;
