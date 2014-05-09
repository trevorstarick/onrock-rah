var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('grvKr3a0xPfJbvA4eFgfxQ');

var csv = fs.createWriteStream('log.csv', {
  'flags': 'a'
});

var message = {
  "subject": "On Rock RAH-2014 Registration Confirmation",
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

var text = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"><style>h1,h2,h3,h4,h5,h6,p,blockquote {margin: 0;padding: 0;}body {font-family: "Helvetica Neue", Helvetica, "Hiragino Sans GB", Arial, sans-serif;font-size: 13px;line-height: 18px;color: #737373;background-color: white;margin: 10px 13px 10px 13px;}a {color: #0069d6;}a:hover {color: #0050a3;text-decoration: none;}a img {border: none;}p {margin-bottom: 9px;}h1,h2,h3,h4,h5,h6 {color: #404040;line-height: 36px;}h1 {margin-bottom: 18px;font-size: 30px;}h2 {font-size: 24px;}</style><title>Thank you for Registering</title></head><body><h1>Thank you for Registering</h1><p></p><p><b>This email address was used to register you for "On Rock Riders Against Hunger".</b></p><p>If you did not register please reply to this email letting us know, and we will remove you from our registration database.</p><p><a href="http:\/\/www.onrock.org">www.onrock.org</a></p><br /><hr /><br /><h2>Your registration ID is: <u>{{id}}</u></h2><br /><p>Registration fee is $35, per person, riders and passengers must pay.  The $35 includes the ride and a free t-shirt.</p><br /><p>The goal is to raise money by getting your family, friends and colleagues to make a donation toward your ride.  <b><i>For every $50 you raise, you will receive a ticket and a chance to win the Grand Prize (valued at over $500).</b>  <u>These tickets cannot be bought</u>.  The only way to get Grand Prize tickets is to raise money.</i></p><br /><p>Raise $50 and receive, a Grand Prize ticket.</p><p>Raise $100 in donations, and get the Ride patch free (patch is worth $10).</p><p>Raise $150 in donations, your registration fee is waived and you get the Ride pin free (pin is worth $10).</p><p>Raise $500 or more – Elite Rider RAH logo back patch (New this year).</p><br /><p>One Grand Prize ticket will be given for every $50 raised (tickets cannot be purchased, only way to get Grand Prize tickets is to raise money).</p><br /><h3>To help get you started:</h3><ul><li>Download a donation form (<a href="http:\/\/www.onrock.org/RAH2014_pledge_web.pdf">from here</a>) and begin collecting donations <i>(let your donors know that tax receipts will be issued for donations over $20)</i>.</li><li>Remember, a ticket for the Grand Prize draw will be given for every $50 collected.</li><li>Prizes will also awarded to the best "<b>Poker Hand</b>", and the "<b>Top Fundraiser</b>".</li></ul><br /><h3>On Ride-Day, bring with you:</h3><ul><li>Your registration ID from above (or print a copy of this e-mail).</li><li>Your registration fee.</li><li>Completed donation form(s) along with your accumulated donations (donations will be accepted by Cash, Cheque, or Credit Card).</li></ul><br /><h3>Using Online Donations</h3><p>We encourage you to provide a method for your famil, friends, and colleqgues to support you via an online donation, consider setting up your own online "Giving Page" at Canada Helps.  The process is easy following these steps:</p><ul><li>Go to <a href="https:\/\/www.canadahelps.org\/GivingPages\/GivingPages.aspx"> CanadaHelps GivingPages </a> secure web site.</i><li>On the <b>"GivingPages"</b> screen, select the option to <u>Create a GivingPage</u> located under the "Your GivingPage" section.</li><li>You will be directed to the <b>"Login"</b> screen.</li><ul><li>If you don\'t have an account, select the option to create a new CanadaHelps account and then select how you want to register with CanadaHelps.</li><li>On the <b>"Which account type would you like to register for"</b> screen, select the option for <u>GivingPage Account</u>.</li><li>Follow the instructions to complete your account registration.</li></ul><li>From the <b>"My GivingPages"</b> screen, select the option to <u>Create GivingPage</u>.</li> <li>Create your GivingPage simply by answering the questions.</li><li>When you are asked for the <b>Charity Name</b>, type in "On Rock Community Services".  We are registered already and you will see our charitable registration number.</li><li>Donors will automatically receive a charitable donations tax receipt from Canada Helps.</li></ul><br /><p>Have fun and rember,</p><p><b>All money raised helps those in need in our community…so let\’s go out there and start fund raising.</b></p><br /><p>Thank you again,</p><br /><p><i>The On Rock RAH team</i></p><p><a href="http://www.onrock.org/rah2014.html"> www.onrock.org/rah2014 </a>';
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
  csv.write(values.join("\t") + '\r\n');
  res.send(200);
});

app.listen(3000);
