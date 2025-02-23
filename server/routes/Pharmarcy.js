const express = require('express');
const router = express.Router();

// Import the Pharmacy model
const Pharmacy = require('../models/Pharmacy');

// POST: Create a new pharmacy record with userId and drug details
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      patientName,
      patientPhone,
      relativeName,
      relativePhone,
      drugs,
    } = req.body;

    // Create a new document based on the Pharmacy model
    const newRecord = new Pharmacy({
      userId, // user ID from the frontend (Google user ID, for example)
      patientName,
      patientPhone,
      relativeName,
      relativePhone,
      drugs, // expecting an array of drug objects
    });

    // Save the document to MongoDB
    const savedRecord = await newRecord.save();
    return res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating pharmacy record:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all pharmacy records (optionally you can filter by userId)
router.get('/', async (req, res) => {
  try {
    const records = await Pharmacy.find();
    return res.json(records);
  } catch (error) {
    console.error('Error fetching pharmacy records:', error);
    return res.status(500).json({ error: error.message });
  }
});

// (Optional) GET by ID: Retrieve a specific record
router.get('/:id', async (req, res) => {
  try {
    const record = await Pharmacy.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    return res.json(record);
  } catch (error) {
    console.error('Error fetching record by ID:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
