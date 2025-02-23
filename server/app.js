// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import your routes
const pharmacyRoutes = require('./routes/Pharmarcy'); // Note: Ensure the filename matches exactly
const twilioCallbackRoutes = require('./routes/twilioCallback');

// Use routes
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/twilio', twilioCallbackRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Medication Reminder API');
});

// Start the scheduler (for sending notifications)
require('./scheduler');

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
