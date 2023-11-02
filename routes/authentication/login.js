// Import the necessary libraries and modules.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRegistration = require('../../models/user_registration_model');

// Define a POST route for the login endpoint.
router.post('/', async(req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        // Check if the user with the provided email exists
        const user = await UserRegistration.findOne({
            email
        });

         if (!user) {    // If the user is not found, return a 401 (Unauthorized) response with an error message.
            return res.status(401).json({
                message: 'User not found!',
                error: 'no_user'
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {   // If the password is invalid, return a 401 (Unauthorized) response with an error message.
            return res.status(401).json({
                message: 'Invalid email or password',
                error: 'incorrect_credentials'
            });
        }

        // Generate a JSON Web Token (JWT) for the authenticated user.
        const token = jwt.sign({
            userId: user._id
        }, 'your-secret-key', {
            expiresIn: '1h'
        });

        res.status(200).json({      // Return a 200 (Success) response with the JWT token.
            message: 'Login Success',
            eror: null,
            token: token
        });
    } catch (error) {            // If an error occurs during the login process, 
                                // display the error and return a 500 (Internal Server Error) response.
        console.error(error);
        res.status(500).json({
            message: message,
            error: 'unknown_error'
        });
    }
});

module.exports = router;