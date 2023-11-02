// Import the 'mongoose' library for MongoDB operations.
const mongoose = require('mongoose');

// Define a Mongoose schema for the 'uploadRecord' collection.
const uploadRecordSchema = new mongoose.Schema({
    // User ID of the uploader
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    // Type of symptom reported
    symptom_type: {
        type: String,
        required: true,
    },
    // Category of disease (insect, leaf, fruit)
    category: String,
    // Affected radius information
    affected_radius: String,
    // Location with geographic coordinates
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
    // Recent treatments applied
    recent_treatments: String,
    // Current status of the record
    status: String,
    // URLs of uploaded images
    image_urls: {
        type: [String],
        required: true,
    },
    // URLs for any generated output
    output_urls: {
        type: [String],
        required: true,
    },
    // Labels for the output data
    output_labels: [String],
    // Timestamp of record creation
    created_at: {
        type: Date,
        default: Date.now,
    },
});

// Create a 2dsphere index on the 'location' field for geospatial queries.
uploadRecordSchema.index({ location: '2dsphere' });

// Create a Mongoose model named 'UploadRecord' based on the 'uploadRecordSchema'.
const UploadRecord = mongoose.model('UploadRecord', uploadRecordSchema);

// Export the 'UploadRecord' model for use in other parts of your application.
module.exports = UploadRecord;
