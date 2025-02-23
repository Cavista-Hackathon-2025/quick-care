const twilio = require('twilio');
const Pharmacy = require('../models/Pharmacy');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Sends a WhatsApp message using template messaging if available,
 * otherwise falls back to plain text.
 * This function always removes any existing "whatsapp:" prefix from the target phone number
 * and then re-applies it.
 *
 * @param {string} to - The recipient's phone number.
 * @param {string} body - The plain text message (fallback).
 * @param {Object} [templateVars] - Template variables if needed.
 * @returns {Promise} - Resolves to the Twilio message object.
 */
async function sendNotification(to, body, templateVars) {
  try {
    console.log('Twilio Config:', {
      accountSid: accountSid ? 'Set' : 'Not Set',
      authToken: authToken ? 'Set' : 'Not Set',
      from: process.env.TWILIO_PHONE_NUMBER ? 'Set' : 'Not Set'
    });
    
    // Clean the phone number: remove any existing "whatsapp:" prefix.
    const cleanTo = to.replace(/^whatsapp:/, '');
    const formattedTo = `whatsapp:${cleanTo}`;
    
    // If template messaging environment variables are set, use them.
    if (process.env.TWILIO_CONTENT_SID && process.env.TWILIO_CONTENT_VARIABLES) {
      console.log('Sending template WhatsApp message using contentSid and contentVariables.');
      
      const message = await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        contentSid: process.env.TWILIO_CONTENT_SID,
        contentVariables: templateVars ? JSON.stringify(templateVars) : process.env.TWILIO_CONTENT_VARIABLES,
        to: formattedTo,
        statusCallback: process.env.TWILIO_CALLBACK_URL
      });
      
      console.log('WhatsApp template message sent successfully:', {
        messageSid: message.sid,
        status: message.status
      });
      
      return message;
    } else {
      console.log('Sending plain text WhatsApp message:', { to: formattedTo, body });
      
      const message = await client.messages.create({
        body,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
        to: formattedTo,
        statusCallback: process.env.TWILIO_CALLBACK_URL
      });
      
      console.log('Plain text WhatsApp message sent successfully:', {
        messageSid: message.sid,
        status: message.status
      });
      
      return message;
    }
  } catch (err) {
    console.error("Detailed error sending notification:", {
      error: err.message,
      code: err.code,
      moreInfo: err.moreInfo,
      status: err.status
    });
    throw err;
  }
}

/**
 * Handles medication confirmation received via WhatsApp.
 * Cleans the incoming phone number before matching it with stored records.
 *
 * @param {string} userPhone - The sender's phone number.
 * @returns {Promise<Object>} - An object with a message property.
 */
async function handleMedicationConfirmation(userPhone) {
  try {
    console.log('Processing confirmation for:', userPhone);
    const cleanPhone = userPhone.replace(/^whatsapp:/, '');
    
    const record = await Pharmacy.findOne({
      patientPhone: cleanPhone,
      'drugs.isActive': true
    });

    if (!record) {
      console.log('No active prescriptions found for:', userPhone);
      return { message: "No active prescriptions found." };
    }

    const currentPeriod = getCurrentPeriod();
    const today = new Date().toISOString().split('T')[0];
    let takenMeds = [];
    let nextDoses = [];

    for (const drug of record.drugs) {
      if (!drug.isActive) continue;
      if (isDoseRequired(drug.dosage, currentPeriod)) {
        const alreadyTaken = drug.history.some(h => 
          h.date.toISOString().split('T')[0] === today &&
          h.period === currentPeriod &&
          h.taken
        );
        if (!alreadyTaken) {
          drug.history.push({
            date: new Date(),
            period: currentPeriod,
            taken: true,
            missedDose: false
          });
          takenMeds.push(drug.drugName);
          
          const todaysDoses = drug.history.filter(h => 
            h.date.toISOString().split('T')[0] === today && h.taken
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
    console.log('Confirmation processed successfully');

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

function getCurrentPeriod() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

function isDoseRequired(dosagePattern, period) {
  const [morning, afternoon, evening] = dosagePattern.split('').map(Number);
  switch (period) {
    case 'morning': return morning === 1;
    case 'afternoon': return afternoon === 1;
    case 'evening': return evening === 1;
    default: return false;
  }
}

module.exports = {
  sendNotification,
  handleMedicationConfirmation
};
