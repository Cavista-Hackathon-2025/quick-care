const cron = require('node-cron');
const Pharmacy = require('./models/Pharmacy');
const { sendNotification, handleMedicationConfirmation } = require('./services/twilioService');

// Helper function to determine current period based on time of day
function getCurrentPeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 || hour < 5) return 'evening';
}

// Helper function to check if a dose should be marked as missed
function shouldMarkAsMissed(period, dosagePattern) {
  const currentHour = new Date().getHours();
  const [morning, afternoon, evening] = dosagePattern.split('').map(Number);
  
  switch(period) {
    case 'morning':
      return morning === 1 && currentHour >= 12;
    case 'afternoon':
      return afternoon === 1 && currentHour >= 17;
    case 'evening':
      return evening === 1 && currentHour >= 23;
    default:
      return false;
  }
}

// Helper function to determine if dose is required for current period
function isDoseRequired(dosagePattern, period) {
  const [morning, afternoon, evening] = dosagePattern.split('').map(Number);
  
  switch(period) {
    case 'morning': return morning === 1;
    case 'afternoon': return afternoon === 1;
    case 'evening': return evening === 1;
    default: return false;
  }
}

// Run every minute to check for missed doses
cron.schedule('* * * * *', async () => {
  try {
    console.log(`[${new Date().toISOString()}] Running medication check...`);
    
    const records = await Pharmacy.find({
      'drugs.isActive': true
    });

    const currentPeriod = getCurrentPeriod();
    console.log(`Current period: ${currentPeriod}`);

    for (const record of records) {
      console.log(`Checking record for patient: ${record.patientPhone}`);
      
      for (const drug of record.drugs) {
        if (!drug.isActive) continue;

        const today = new Date().toISOString().split('T')[0];
        console.log(`Checking ${drug.drugName} for ${today}`);

        // Check if dose is required and hasn't been taken
        if (isDoseRequired(drug.dosage, currentPeriod)) {
          const periodTaken = drug.history.some(h => 
            h.date.toISOString().split('T')[0] === today && 
            h.period === currentPeriod &&
            h.taken
          );

          console.log(`${drug.drugName} - Dose required: true, Taken: ${periodTaken}`);

          if (!periodTaken && shouldMarkAsMissed(currentPeriod, drug.dosage)) {
            console.log(`Marking missed dose for ${drug.drugName}`);
            
            // Mark as missed
            drug.history.push({
              date: new Date(),
              period: currentPeriod,
              taken: false,
              missedDose: true
            });

            // Send missed dose notification via WhatsApp
            const messageBody = `⚠️ Missed dose alert:\n${drug.drugName} for ${currentPeriod} period\n\nPlease take your medication as soon as possible.`;
            
            try {
              console.log(`Sending WhatsApp notification to patient: ${record.patientPhone}`);
              await sendNotification(record.patientPhone, messageBody);
              
              if (record.relativePhone) {
                console.log(`Sending WhatsApp notification to relative: ${record.relativePhone}`);
                await sendNotification(record.relativePhone, 
                  `⚠️ Medication Alert:\nYour relative missed their dose of ${drug.drugName} for the ${currentPeriod} period.`
                );
              }
            } catch (err) {
              console.error(`Failed to send WhatsApp notification:`, err);
            }
          }
        } else {
          console.log(`${drug.drugName} - No dose required for current period`);
        }
      }
      await record.save();
    }
    
    console.log(`[${new Date().toISOString()}] Medication check completed`);
  } catch (error) {
    console.error("Error in missed dose check:", error);
  }
});

module.exports = {
  handleMedicationConfirmation
};