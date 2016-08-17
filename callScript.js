//settings
var cost = 100000000000; // this equals 0.1 Monero
//requirements 
var moneroWallet = require('./lib/wallet');
var Wallet = new moneroWallet();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const crypto = require('crypto');

//database setup
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
var Call = require('./models/Calls');

//Twilio Credentials
var configTwilio = require('./config/twilio.js');
var twilio = require('twilio');
var client = new twilio.RestClient(configTwilio.AccountSid, configTwilio.AuthToken);

crypto.randomBytes(32, (err, buf) => {
  if (err) throw err;
  Wallet.getPayments(buf.toString('hex')).then(function(result) {
    // console.log(result);
  });
});

function checkCalls() {
  Call.find({ "called": false }, function(err, calls) {
    calls.forEach(function(call) {
      Wallet.getPayments(call.paymentID).then(function(result) {
        var paidBalance = 0;
        result.payments.forEach(function(payment) {
          paidBalance += payment.amount;
        });
        if (paidBalance >= cost) {
          if (call.type == "text") {
            sendText(call.number, call.message);
            markCalled(call.paymentID);
          } else {
            makeCall(call.number, call.message);
            markCalled(call.paymentID);
          }
        }
      });
      // res.send('Thing retrieved:' + record.id);
    });
  });
}

function makeCall(number, message) {
  console.log("making a call");
  client.makeCall({
    to: number,
    from: configTwilio.TwilioNumber,
    url: '/call'
  });
}

function markCalled(payId) {
Call.update(
   { 'paymentID' : payId }, 
   { $set: { 'called': true } },
   function (err, result) {
      if (err) throw err;
      console.log(result);
   });
}

function sendText(number, message) {
  console.log("sending a text");
  client.sms.messages.create({
    to: number,
    from: configTwilio.TwilioNumber,
    body: message
  }, function(error, message) {
    if (!error) {
      console.log('Success! The SID for this SMS message is:');
      console.log(message.sid);

      console.log('Message sent on:');
      console.log(message.dateCreated);
    } else {
      console.log('Oops! There was an error.');
    }
  });
  console.log("send '" + message + "' to " + number);
}

console.log("Checking for new payments every 5 minutes");
var timer = setInterval(checkCalls, 300000);
