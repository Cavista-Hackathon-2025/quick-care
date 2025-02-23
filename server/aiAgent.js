// aiAgent.js
const Together = require("together-ai").default;
const { sendNotification } = require("./services/twilioService");

// Initialize Together.ai with your API key
const together = new Together({
  apiKey: "34f780929ade9605698ad8dd16c86b1cf59f2a26b8bd5f757a3b87fc29a621e2"
});

/**
 * Generates a friendly health suggestion message using Together.ai and sends it via WhatsApp.
 * @param {string} patientPhone - The recipient's phone number in international format (e.g. "+2349015208215").
 * @param {Object} medicationDetails - Optional details about the medication (e.g. drugName).
 */
async function sendDailyHealthSuggestion(patientPhone, medicationDetails = {}) {
  try {
    // Build a prompt that can incorporate medication details if provided.
    const prompt = `
You are a friendly health assistant. The patient is currently taking ${medicationDetails.drugName || "their medication"}. 
Please ask the patient how they are feeling today and offer one personalized health suggestion in a supportive, friendly tone.
Respond with a brief message.
    `;
    
    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo"
    });
    
    const suggestion = response.choices[0].message.content;
    console.log("Generated health suggestion:", suggestion);
    
    // Send the suggestion via WhatsApp using your Twilio integration.
    await sendNotification(patientPhone, suggestion);
  } catch (error) {
    console.error("Error generating or sending health suggestion:", error);
  }
}

module.exports = { sendDailyHealthSuggestion };
