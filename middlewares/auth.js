const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: Token missing' });
    }

    jwt.verify(token, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Access Denied: Invalid token' });
        }

        req.userId = decoded.userId;
        next();
    });
}

module.exports = verifyToken;
