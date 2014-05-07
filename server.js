var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('grvKr3a0xPfJbvA4eFgfxQ');

var csv = fs.createWriteStream('log.csv', {
  'flags': 'a'
});

var message = {
  "subject": "RAH-2014 Sign Up Confirmation",
  "from_email": "RAH@onrock.org",
  "from_name": "On-Rock RAH",
  "headers": {
    "Reply-To": "RAH@onrock.org"
  },
  "tags": [
    "riders-against-hunger"
  ],
  "metadata": {
    "website": "www.onrock.org"
  }
};

var text = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><style>h1,h2,h3,h4,h5,h6,p,blockquote {margin: 0;padding: 0;}body {font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;font-size: 13px;line-height: 18px;color: #737373;background-color: white;margin: 10px 13px 10px 13px;}a {color: #0069d6;}a:hover {color: #0050a3;text-decoration: none;}a img {border: none;}p {margin-bottom: 9px;}h1,h2,h3,h4,h5,h6 {color: #404040;line-height: 36px;}h1 {margin-bottom: 18px;font-size: 30px;}h2 {font-size: 24px;}</style><title>Thank you for Registering</title></head><body><h2>Thank you for Registering</h2><br /><p><b>This email address was used to register you for OnRock\'s Riders Against Hunger.</b></p><p>If you didn\'t register, please reply to this email asking to be removed.</p><br /><hr /><br /><p><b>Your registration ID is {{id}}</b></p><br /><p>Registration fee is $35, per person, riders and passengers must pay. The $35 includes the ride and a free t-shirt.</p><p>Raise $50 and receive,  Ride t-shirt &amp; a raffle ticket (1 raffle ticket for every $50 raised)</p><p>Raise $100 in donations, and get the Ride patch free or patch is $10</p><p>Raise $150 in donations, waive registration fee and get the Ride pin free or pin is $10</p><p>Raise $500 or more – Elite Rider RAH logo back patch</p><p>One Grand Prize ticket (worth over $500) will be given for every $50 raised.  The only way to get Grand Prize tickets is to raise money.  Raffle tickets cannot be purchased.</p><ul><li>Download a <a href="http:\/\/www.onrock.org/RAH2014_pledge_web.pdf">donation form</a> and collect donations. Tax receipts will be issued for each individual donation over $20.</li><li>A draw ticket for the Grand Draw Prize will be given for every $50 collected.</li><li>Prizes also awarded to the best Poker Hand and the Top Fundraiser.On ride day, bring your registration fee and completed donation form(s) along with your accumulated donations.  Donations will be accepted by Cash, Cheque or Credit Card</li></ul><h3>Online Donations</h3><p>We encourage you to provide a method for your friends to support you via an online donation, consider setting up your own online "Giving Page" at Canada Helps.</p><ul><li>Select the option to "Create a Giving Page"</li><li>As a new user, select the option to Register with Canada Helps</li><li>You will then be able to create your Giving Page simply by answering the questions</li><li>When you are asked for the Charity, type in "On Rock Community Services". We are registered already and you will see our charitable registration number.</li><li>Donors will automatically receive a charitable donations tax receipt from Canada Helps</li></ul><br /><br /><p>Regards,<br/>On Rock RAH</p></body></html>';

var app = express();

app.use(bodyParser());

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
  var obj = req.body;
  var values = [];
  var id = Date.now().toString().substring(0, 10);
  message.to = [{
    "email": obj.vRiderEmail,
    "name": obj.vRiderFirstName + ' ' + obj.vRiderLastName,
    "type": "to"
  }, {
    "email": "RAH@onrock.org",
    "name": "On-Rock RAH",
    "type": "cc"
  }, {
    "email": "onrock.support@starick.com",
    "name": "OnRock",
    "type": "bcc"
  }];
  console.log(message.to);
  values.push(id);
  for (var each in obj) {
    values.push(obj[each]);
  }
  message.html = text.replace('{{id}}', id);
  mandrill_client.messages.send({
    "message": message,
  }, function(result) {
    console.log(Date.now());
    console.log(result);
  }, function(e) {
    console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
  });
  csv.write(values.join(",") + '\n');
  res.send(200);
});

app.listen(3000);