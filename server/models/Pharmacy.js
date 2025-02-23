const mongoose = require('mongoose');

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
  // Modified time field to support multiple daily doses
  scheduledTimes: [{
    type: String,  // Store times in 24-hour format (HH:mm)
    required: true
  }],
  // Add duration tracking
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  duration: {
    days: {
      type: Number,
      required: true
    },
    taken: {
      type: Number,
      default: 0
    }
  },
  // Track if medication is active
  isActive: {
    type: Boolean,
    default: true
  },
  // Track medication history
  history: [{
    date: Date,
    taken: Boolean,
    confirmedAt: Date
  }]
});

const PharmacySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientPhone: {
    type: String,
    required: true,
  },
  relativeName: {
    type: String,
    default: '',
  },
  relativePhone: {
    type: String,
    default: '',
  },
  drugs: {
    type: [DrugSchema],
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);

