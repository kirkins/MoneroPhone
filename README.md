# Monero Phone

A node.js app which allows users to place an order requesting a text message be sent. The user is then given a paymentId which if used to send 0.1 monero will result in a text being sent. This app is built on top of [monero node.js](https://github.com/PsychicCat/monero-nodejs).

For more information about Monero, visit: https://getmonero.org/home

Requirments:
  - Running full Monero node
  - Run simple wallet over rpc with the following command 'sudo ./simplewallet --wallet-file /full/path/to/wallet --password "yourPassword" --rpc-bind-port 18082'
  - Running MongoDb

Setup:
  - update twilio config file with your credentials.
  - node index.js # to start website
  - node callScript.js # to start listening for incoming payments
  - update views/submit.ejs with your wallets monero address


