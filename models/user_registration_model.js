const mongoose = require('mongoose');

const userRegistrationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    birthday: Date,
    address: String,
    profession: String,
    location: {
        type: { type: String, default: 'Point' },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
    },
    password: { type: String, required: true },
    fcm_token: String,
    createdOn: { type: Date, default: Date.now },
});

userRegistrationSchema.index({ location: '2dsphere' });

const UserRegistration = mongoose.model('UserRegistration', userRegistrationSchema);

module.exports = UserRegistration;
