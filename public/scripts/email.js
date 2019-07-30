require('dotenv').config();

const mailgun = require('mailgun-js');

//const DOMAIN = mg_domain;
//const API_KEY = mg_api_key;
const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

const data = {
  from: 'me@samples.mailgun.org',
  to: 'captain.strides@gmail.com',
  subject: 'Thanks for creating your poll!',
  text: `Thank you for creating your poll!  Your administrator link can be found at <admin_url>
  Now it's up to you to send this link <voter_url> to those who you want to include in the voting!
  Come back to your admin_url page anytime to view the results of the poll.`
};

mg.messages().send(data, (error, body) => {
  console.log(body);
  console.log(error);
  // console.log(data);
});

//console.log('process', process.env);


// routes.post('/events', (req, res) => {

//   mg.messages().send(data, (error, body) => {
//     console.log(body);
//     //console.log(data);
//   });
//   res.redirect('/home')
// })
