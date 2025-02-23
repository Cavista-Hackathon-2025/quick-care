// services/twilioService.js
const twilio = require('twilio');
const Pharmacy = require('../models/Pharmacy');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

function getCurrentPeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

function isDoseRequired(dosagePattern, period) {
  const [morning, afternoon, evening] = dosagePattern.split('').map(Number);
  switch(period) {
    case 'morning': return morning === 1;
    case 'afternoon': return afternoon === 1;
    case 'evening': return evening === 1;
    default: return false;
  }
}

async function sendNotification(to, body) {
  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
      statusCallback: process.env.TWILIO_CALLBACK_URL
    });
    return message;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw err;
  }
}

async function handleMedicationConfirmation(userPhone) {
  try {
    const record = await Pharmacy.findOne({
      patientPhone: userPhone.replace('whatsapp:', ''),
      'drugs.isActive': true
    });

    if (!record) {
      return { message: "No active prescriptions found." };
    }

    const currentPeriod = getCurrentPeriod();
    const today = new Date().toISOString().split('T')[0];
    let takenMeds = [];
    let nextDoses = [];

    for (const drug of record.drugs) {
      if (!drug.isActive) continue;

      if (isDoseRequired(drug.dosage, currentPeriod)) {
        // Check if already taken today
        const alreadyTaken = drug.history.some(h => 
          h.date.toISOString().split('T')[0] === today && 
          h.period === currentPeriod &&
          h.taken
        );

        if (!alreadyTaken) {
          // Log the dose
          drug.history.push({
            date: new Date(),
            period: currentPeriod,
            taken: true,
            missedDose: false
          });

          takenMeds.push(drug.drugName);

          // Check if all today's doses are complete
          const todaysDoses = drug.history.filter(h => 
            h.date.toISOString().split('T')[0] === today && 
            h.taken
          ).length;

          const requiredDoses = drug.dosage.split('')
            .reduce((sum, curr) => sum + parseInt(curr), 0);

          if (todaysDoses === requiredDoses) {
            drug.duration.taken += 1;
            if (drug.duration.taken >= drug.duration.days) {
              drug.isActive = false;
            }
          }
        }
      }

      // Check for next doses
      const [morning, afternoon, evening] = drug.dosage.split('').map(Number);
      const periods = ['morning', 'afternoon', 'evening'];
      const currentIndex = periods.indexOf(currentPeriod);
      
      for (let i = currentIndex + 1; i < periods.length; i++) {
        if ((periods[i] === 'morning' && morning === 1) ||
            (periods[i] === 'afternoon' && afternoon === 1) ||
            (periods[i] === 'evening' && evening === 1)) {
          nextDoses.push(`${drug.drugName} (${periods[i]})`);
        }
      }
    }

    await record.save();

    // Prepare response message
    let message = '';
    if (takenMeds.length > 0) {
      message += `✅ Logged for ${currentPeriod}:\n${takenMeds.join('\n')}\n\n`;
    } else {
      message += `No medications due for ${currentPeriod}\n\n`;
    }

    if (nextDoses.length > 0) {
      message += `⏰ Next doses:\n${nextDoses.join('\n')}`;
    }

    return { message };
  } catch (error) {
    console.error('Error processing medication confirmation:', error);
    return { message: 'Error processing your confirmation. Please try again.' };
  }
}

module.exports = {
  sendNotification,
  handleMedicationConfirmation
};