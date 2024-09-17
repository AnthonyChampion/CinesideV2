const jwt = require('jsonwebtoken');
const userService = require('../services/userService');


const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Token Required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        user = await userService.getUserByEmail(email);
        if (user) {
            req.user = user;
        }
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid Access Token' });
    }
};

module.exports = authMiddleware;
