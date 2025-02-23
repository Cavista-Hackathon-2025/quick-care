const cron = require('node-cron');
const Pharmacy = require('./models/Pharmacy');
const { sendNotification } = require('./services/twilioService');

// Helper function to check if a medication should be taken at current time
function shouldTakeMedication(scheduledTimes) {
  const now = new Date();
  const currentHour = now.getHours().toString().padStart(2, '0');
  const currentMinute = now.getMinutes().toString().padStart(2, '0');
  const currentTime = `${currentHour}:${currentMinute}`;
  
  return scheduledTimes.some(time => {
    // Allow 5-minute window before and after scheduled time
    const [schedHour, schedMinute] = time.split(':');
    const scheduledDate = new Date();
    scheduledDate.setHours(parseInt(schedHour), parseInt(schedMinute));
    
    const timeDiff = Math.abs(now - scheduledDate);
    return timeDiff <= 5 * 60 * 1000; // 5 minutes in milliseconds
  });
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running medication check...');
  try {
    const records = await Pharmacy.find({
      'drugs.isActive': true
    });

    for (const record of records) {
      for (const drug of record.drugs) {
        if (!drug.isActive) continue;

        // Check if medication duration is complete
        if (drug.duration.taken >= drug.duration.days) {
          drug.isActive = false;
          await record.save();
          continue;
        }

        // Check if it's time to take this medication
        if (shouldTakeMedication(drug.scheduledTimes)) {
          const today = new Date().toISOString().split('T')[0];
          
          // Check if medication was already taken today
          const takenToday = drug.history.some(h => 
            h.date.toISOString().split('T')[0] === today && h.taken
          );

          if (!takenToday) {
            const messageBody = `Time to take ${drug.drugName} (${drug.dosage}). Please confirm when taken.`;
            
            try {
              await sendNotification(record.patientPhone, messageBody);
              
              // Add to history
              drug.history.push({
                date: new Date(),
                taken: false,
                confirmedAt: null
              });
              
              await record.save();
              console.log(`Notification sent to ${record.patientPhone} for ${drug.drugName}`);
            } catch (err) {
              console.error(`Failed to send notification for ${drug.drugName}:`, err);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in scheduled job:", error);
  }
});

// Endpoint to confirm medication was taken
async function confirmMedicationTaken(userId, drugId) {
  try {
    const record = await Pharmacy.findOne({
      userId,
      'drugs._id': drugId
    });

    if (!record) return false;

    const drug = record.drugs.id(drugId);
    if (!drug) return false;

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
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error confirming medication:", error);
    return false;
  }
}