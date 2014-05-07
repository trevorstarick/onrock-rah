var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('grvKr3a0xPfJbvA4eFgfxQ');

var csv = fs.createWriteStream('log.csv', {
  'flags': 'a'
});

var app = express();

app.use(bodyParser());

var message = {
  "subject": "RAH-2014 Sign Up Confirmation",
  "from_email": "kim@onrock.org",
  "from_name": "Kim Reid",
  "to": [{
    "email": "onrock.support@starick.com",
    "name": "OnRock",
    "type": "bcc"
  }, {
    "email": "kim@onrock.org",
    "name": "Kim Reid",
    "type": "cc"
  }],
  "headers": {
    "Reply-To": "kim@onrock.org"
  },
  "tags": [
    "riders-against-hunger"
  ],
  "metadata": {
    "website": "www.onrock.org"
  }
};

app.get('/', function(req, res) {
  var fileStream = fs.createReadStream('log.csv');
  // res.write('timestamp,name-first, name-last, name-shirt, passenger-first, passenger-last, passenger-shirt, name-email, name-phone, name-goal, name-address, name-city, name-postalcode, name-type\n');
  fileStream.on('data', function(data) {
    res.write(data);
  });
  fileStream.on('end', function() {
    res.end();
  });
});

app.post('/', function(req, res) {
  obj = req.body;
  var values = [];
  message.to.push({
    "email": req.body.email,
    "name": req.body['name-first'],
    "type": "to"
  });
  values.push(Date.now());
  for (var each in obj) {
    values.push(obj[each]);
  }
  message.text = JSON.stringify(obj, null, 4);
  mandrill_client.messages.send({
    "message": message,
  }, function(result) {
    console.log(result);
  }, function(e) {
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
  csv.write(values.join(",") + '\n');
});

app.listen(3000);
