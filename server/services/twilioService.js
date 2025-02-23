// services/twilioService.js
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken); // Initialize the client

/**
 * Sends an SMS notification via Twilio.
 * @param {string} to - The recipient's phone number (with country code).
 * @param {string} body - The text message to send.
 * @returns {Promise} - A promise resolving to the Twilio message object.
 */
module.exports.sendNotification = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`, // e.g., "whatsapp:+14155238886"
      to: `whatsapp:${to}`,
      statusCallback: process.env.TWILIO_CALLBACK_URL
    });
    return message;
  } catch (err) {
    console.error("Error sending notification:", err);
    throw err;
  }
};
