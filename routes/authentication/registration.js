// Import the necessary libraries and modules.
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const UserRegistration = require('../../models/user_registration_model');

// Define a POST route for user registration.
router.post('/', async(req, res) => {
    try {
        const { //extracts the values associated with  user registration data fields from the request body.
            name,
            email,
            mobile,
            birthday,
            address,
            profession,
            password,
            fcm_token,
            latitude,
            longitude
        } = req.body;

         // Check if the email is already registered in the database.
        const existingUser = await UserRegistration.findOne({
            email
        });

        if (existingUser) {
             // If the email already exists, return a 400 (Bad Request) response with a message.
            return res.status(400).json({
                message: 'Email already exists'
            });
        }

         // Hash the provided password using bcrypt with a salt factor of 10.
        const hashedPassword = await bcrypt.hash(password, 10);

         // Create a new user registration with the provided data.
        const newUser = new UserRegistration({
            name,
            email,
            mobile,
            birthday,
            address,
            profession,
            location: {
                type: 'Point',
                coordinates: [parseFloat(latitude), parseFloat(longitude)]
            },
            password: hashedPassword,
            fcm_token: fcm_token

        });

        // Save the new user to the database.
        await newUser.save();

         // Return a 201 (Created) response indicating successful registration.
        res.status(201).json({
            eror: null,
            message: 'Registration successful'
        });
    } catch (error) {
         // If an error occurs during registration, log the error and return a 500 (Internal Server Error) response.
        console.error(error);
        res.status(500).json({
            message: error,
            error: "unknown_error"
        });
    }
});

// Export the 'router' object, which defines the registration route
module.exports = router;