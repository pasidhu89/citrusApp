const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: Date,
    residentialAddress: String,
    occupation: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    },
    userPassword: { type: String, required: true },
    fcmToken: String,
    registrationDate: { type: Date, default: Date.now },
});

registrationSchema.index({ location: '2dsphere' });

const UserRegistration = mongoose.model('UserRegistration', registrationSchema);

module.exports = UserRegistration;
