const cron = require('node-cron');
const Pharmacy = require('./models/Pharmacy');
const { sendNotification } = require('./services/twilioService');

// Schedule the job to run every hour (at minute 0 of every hour)
cron.schedule('0 * * * *', async () => {
  console.log('Running scheduled notification job...');
  try {
    // Retrieve all pharmacy records from the database
    const records = await Pharmacy.find();
    
    // Loop through each record and send a notification to the patientPhone
    records.forEach(record => {
      // Customize your message as needed. Here, we list the drug names.
      const drugsList = record.drugs.map(drug => drug.drugName).join(', ');
      const messageBody = `Reminder: It's time to take your medication (${drugsList}).`;

      sendNotification(record.patientPhone, messageBody)
        .then(msg => console.log(`Notification sent to ${record.patientPhone}: ${msg.sid}`))
        .catch(err => console.error(`Failed to send notification for record ${record._id}:`, err));
    });
  } catch (error) {
    console.error("Error in scheduled job:", error);
  }
});
