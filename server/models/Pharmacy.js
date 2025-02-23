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
    validate: {
      validator: function(v) {
        return /^[0-1]{3}$/.test(v); // Validates pattern like 101, 111, 100
      },
      message: props => `${props.value} is not a valid dosage pattern!`
    }
  },
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
  isActive: {
    type: Boolean,
    default: true
  },
  history: [{
    date: Date,
    period: {
      type: String,
      enum: ['morning', 'afternoon', 'evening']
    },
    taken: Boolean,
    confirmedAt: Date,
    missedDose: Boolean
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