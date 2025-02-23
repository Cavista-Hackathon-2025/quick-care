const express = require('express');
const router = express.Router();
const { handleMedicationConfirmation } = require('../services/twilioService');

// Twilio webhook endpoint
router.post('/webhook', async (req, res) => {
  const userPhone = req.body.From;
  const { message } = await handleMedicationConfirmation(userPhone);
  
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(message);
  
  res.type('text/xml').send(twiml.toString());
});

module.exports = router;