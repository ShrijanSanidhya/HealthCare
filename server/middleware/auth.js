const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt');
        req.userId = decoded.userId;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
