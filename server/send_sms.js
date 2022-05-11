// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const client = require('twilio')(accountSid, authToken);


const sendSMS = function(message, number) {
  //message ='It will take this many minutes'
  client.messages
  .create({
    body: message,
    from: process.env.TWILIO_NUMBER,
    to: number
  })
  .then(message => console.log(message.sid));
}

module.exports = sendSMS;
