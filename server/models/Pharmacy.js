const mongoose = require('mongoose');

// Define a sub-schema for each drug entry
const DrugSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['Syrup', 'Pill', 'Tablet'],
    required: true,
  },
  numberOfPacks: {
    type: Number,
    required: true,
  },
  drugName: {
    type: String,
    required: true,
  },
  dosage: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

// Main schema for pharmacy/prescription data
const PharmacySchema = new mongoose.Schema({
  // Store the user ID from the frontend (e.g., Google user ID)
  userId: {
    type: String,
    required: true,
  },
  // Patient info
  patientName: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  // Relative/Next of Kin info (optional)
  relativeName: {
    type: String,
    default: '',
  },
  relativePhone: {
    type: String,
    default: '',
  },
  // Array of drug objects
  drugs: {
    type: [DrugSchema],
    default: [],
  },
}, {
  timestamps: true, // automatically manages createdAt and updatedAt fields
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);
