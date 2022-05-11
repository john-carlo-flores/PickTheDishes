const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);

const sendSMS = function(message, number) {
  client.messages
  .create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: number
  });
};

module.exports = sendSMS;
