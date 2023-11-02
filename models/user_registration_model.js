// Import the 'mongoose' library for MongoDB operations.
const mongoose = require('mongoose');

/**
 * Define a Mongoose schema for the 'userRegistration' collection.
 */
const userRegistrationSchema = new mongoose.Schema({
    // Define a field 'name'
    name: {
        type: String,
        required: true,
    },
    // Define a field 'email'
    email: {
        type: String,
        required: true,
        unique: true,
    },
    // Define a field 'mobile-number'
    mobile: {
        type: String,
        required: true,
    },
    // Define a field 'birthday'
    birthday: Date,
    // Define a field 'address'
    address: String,
    // Define a field 'profession'
    profession: String,
    // Define a field 'location'
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    },
    // Define a field 'password'
    password: {
        type: String,
        required: true,
    },
    // Define a field 'fcm_token'
    fcm_token: String,
    // Define a field 'createdOn'
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

// Create a geospatial index for the 'location' field.
userRegistrationSchema.index({ location: '2dsphere' });

// Create a Mongoose model for 'UserRegistration' using the schema.
const UserRegistration = mongoose.model('UserRegistration', userRegistrationSchema);

// Export the UserRegistration model.
module.exports = UserRegistration;
