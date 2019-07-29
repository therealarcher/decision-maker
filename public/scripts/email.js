const mailgun = require('mailgun-js');
const DOMAIN = 'sandboxbac46640689e4f21a6b8405d409c6722.mailgun.org';
const API_KEY = '9f0967f2be3f4082351527cf1c81bdb7-c50f4a19-eba714f5';
const mg = mailgun({apiKey: API_KEY, domain: DOMAIN});

const data = {
  from: 'me@samples.mailgun.org',
  to: 'captain.strides@gmail.com',
  subject: 'Thanks for creating your poll!',
  text: `Thank you for creating your poll!  Your administrator link can be found at <admin_url>
  Now it's up to you to send this link <voter_url> to those who you want to include in the voting!
  Come back to your admin_url page to view the results of the poll.`
};

mg.messages().send(data, (error, body) => {
  console.log(body);
  console.log(error);
  console.log(data);
});


// routes.post('/events', (req, res) => {

//   mg.messages().send(data, (error, body) => {
//     console.log(body);
//     //console.log(data);
//   });
//   res.redirect('/home')
// })
