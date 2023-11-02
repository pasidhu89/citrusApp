// Import the necessary libraries and modules.
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const verifyToken = require('../../middlewares/auth');

// Define a POST route for the logout endpoint, and use the 'verifyToken' middleware for authentication.
router.post('/logout', verifyToken, authenticate, (req, res) => {
    try {
        
        // Retrieve the user's ID from the request object, which was set by the 'verifyToken' middleware.
        const userId = req.user.userId;

        // Return a 200 (OK) response indicating a successful logout.
        res.status(200).json({
            message: 'Logout Success',
            error: null,
        });
    } catch (error) {
        console.error(error);   // If an error occurs during the logout process,
                                //  display the error and return a 500 (Internal Server Error) response.
        res.status(500).json({
            message: 'An unknown error occurred',
            error: 'unknown_error',
        });
    }
});

// Export the 'router' object, which defines the logout route,
module.exports = router;