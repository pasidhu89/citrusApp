const jwt = require('jsonwebtoken');

function validateAuth(req, res, next) {
    const authToken = req.headers.authorization;

    if (!authToken) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    jwt.verify(authToken, 'your-secret-key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded.userId;
        next();
    });
}

module.exports = validateAuth;
