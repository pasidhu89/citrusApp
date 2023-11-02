import mongoose from 'mongoose';

const uploadRecordSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    symptom_type: {
        type: String,
        required: true,
    },
    category: String,
    affected_radius: String,
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
    recent_treatments: String,
    status: String,
    image_urls: {
        type: [String],
        required: true,
    },
    output_urls: {
        type: [String],
        required: true,
    },
    output_labels: [String],
    created_at: {
        type: Date,
        default: Date.now,
    },
});

uploadRecordSchema.index({ location: '2dsphere' });

const UploadRecord = mongoose.model('UploadRecord', uploadRecordSchema);

export default UploadRecord;
