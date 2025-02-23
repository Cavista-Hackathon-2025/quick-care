const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');

// POST: Create a new pharmacy record
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

    // Validate and process drug information
    const processedDrugs = drugs.map(drug => ({
      ...drug,
      startDate: new Date(),
      isActive: true,
      duration: {
        days: drug.duration?.days || 0,
        taken: 0
      },
      history: []
    }));

    const newRecord = new Pharmacy({
      userId,
      patientName,
      patientPhone,
      relativeName,
      relativePhone,
      drugs: processedDrugs,
    });

    const savedRecord = await newRecord.save();
    return res.status(201).json(savedRecord);
  } catch (error) {
    console.error('Error creating pharmacy record:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all pharmacy records
router.get('/', async (req, res) => {
  try {
    const records = await Pharmacy.find();
    return res.json(records);
  } catch (error) {
    console.error('Error fetching pharmacy records:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve records for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const records = await Pharmacy.find({ userId: req.params.userId });
    return res.json(records);
  } catch (error) {
    console.error('Error fetching user records:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve a specific record
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

// POST: Confirm medication taken
router.post('/:recordId/drugs/:drugId/confirm', async (req, res) => {
  try {
    const record = await Pharmacy.findById(req.params.recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const drug = record.drugs.id(req.params.drugId);
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    const today = new Date().toISOString().split('T')[0];
    const historyEntry = drug.history.find(h => 
      h.date.toISOString().split('T')[0] === today && !h.taken
    );

    if (historyEntry) {
      historyEntry.taken = true;
      historyEntry.confirmedAt = new Date();
      drug.duration.taken += 1;

      if (drug.duration.taken >= drug.duration.days) {
        drug.isActive = false;
      }

      await record.save();
      return res.json({ success: true, drug });
    }

    return res.status(400).json({ error: 'No pending medication confirmation found for today' });
  } catch (error) {
    console.error('Error confirming medication:', error);
    return res.status(500).json({ error: error.message });
  }
});

// PATCH: Update drug schedule
router.patch('/:recordId/drugs/:drugId', async (req, res) => {
  try {
    const record = await Pharmacy.findById(req.params.recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const drug = record.drugs.id(req.params.drugId);
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'scheduledTimes',
      'dosage',
      'numberOfPacks',
      'duration.days',
      'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          drug[parent][child] = req.body[field];
        } else {
          drug[field] = req.body[field];
        }
      }
    });

    await record.save();
    return res.json(drug);
  } catch (error) {
    console.error('Error updating drug:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET: Get medication history
router.get('/:recordId/drugs/:drugId/history', async (req, res) => {
  try {
    const record = await Pharmacy.findById(req.params.recordId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }

    const drug = record.drugs.id(req.params.drugId);
    if (!drug) {
      return res.status(404).json({ error: 'Drug not found' });
    }

    return res.json({
      drugName: drug.drugName,
      history: drug.history,
      duration: drug.duration,
      isActive: drug.isActive
    });
  } catch (error) {
    console.error('Error fetching drug history:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;