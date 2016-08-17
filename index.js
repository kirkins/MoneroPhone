var express = require('express');
var app = express();
var moneroAddress = "";
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const crypto = require('crypto');

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

var Call = require('./models/Calls');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
function makeid() { 
  var buf = crypto.randomBytes(32);
  return buf.toString('hex');
}

/* GET home page. */
app.get('/', function(req, res) {
    console.log(makeid());
    res.render('index.ejs', {
        randomId: makeid(),
    });
});

app.get('/call', function(req, res) {
    console.log(makeid());
    res.render('call.ejs', {
        randomId: makeid(),
    });
});

app.post('/submit', function(req, res) {
    
    var newCall = new Call({
        number: req.body.phoneNumber,
        message: req.body.textMsg,
        paymentID: req.body.paymentID,
        type: req.body.type
    });

    newCall.save(function(err, thor) {
        if (err) return console.error(err);
        console.dir(newCall);
    });

    res.render('submit.ejs', {
        paymentId: req.body.paymentID,
        type: req.body.type,
    });
});


app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});