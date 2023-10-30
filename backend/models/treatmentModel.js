import mongoose from 'mongoose';

// Create a schema for the treatment model
const treatmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Name of the treatment
  type: {
    // Type of treatment (e.g., organic, conventional, biological)
    type: String,
    enum: ['organic', 'conventional', 'biological'],
    required: true,
  },
  description: { type: String, required: true }, // Description of the treatment
  duration: { type: Number, required: true }, // Duration of the treatment in days
 // Cost of the treatment
});

// Create a Treatment model using the schema
const Treatment = mongoose.model('Treatment', treatmentSchema);

export default Treatment;
