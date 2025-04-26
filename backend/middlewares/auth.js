import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware for authenticating access token
const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401)
            .json({
                success: 'false',
                message: 'Access Denied. No token provided.'
            });
    }

    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if (err) {
            const message = err.name === 'TokenExpiredError'
                ? 'Token has expired. Please refresh your token'
                : 'Token is invalid. Please refresh your token';

            return res.status(401).json({ success: false, message });
        };

        req.user = user;
        next();
    })

}

export default authenticateToken;
