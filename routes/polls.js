const express = require('express');
const router  = express.Router();
require('dotenv').config();
const mailgun = require('mailgun-js');
const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

// function to generate email using mailgun upon poll creation
const generateEmail = function(voter_url, admin_url, email) {

  const data = {
    from: 'me@samples.mailgun.org',
    to: email,
    subject: 'Thanks for creating your poll!',
    text: `Thank you for creating your poll!  Your administrator link can be found at ${admin_url}
    Now it's up to you to send this link ${voter_url} to those who you want to include in the voting!
    Come back to your admin_url page anytime to view the results of the poll.`
  };
  return data;
};

// all route will start with /polls/...

module.exports = (db) => {

  const getPollId = function(voter_URL) {
    return db.query(
      `SELECT id
      FROM polls
      WHERE voter_url = $1;`, [voter_URL]
    );
  };

  let generateRandomString = function() {
    return Math.random().toString(36).substring(2,8);
  };

  // route to list all polls
  router.get("/", (req, res) => {
    db.query(`SELECT title FROM polls;`)
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // route to create a new poll
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  // route to submit poll
  router.post("/", (req, response) => {
    console.log("this worked!");
    console.log(req.body);
    let arrOptions = Object.values(req.body).splice(5);
    let voterUrl = generateRandomString();
    let adminUrl = generateRandomString();

    // Insert user (poll creator) data into the users table
    db.query(`
    INSERT INTO users(name,email)
    VALUES($1,$2)
    RETURNING *`,[req.body.user_name,req.body.user_email])
      .then((resUsers) => {
      // Insert poll data into the polls table
        db.query(`
        INSERT INTO polls(user_id,title,voter_url,admin_url,end_date,created_at)
        VALUES($1,$2,$3,$4,$5,$6) RETURNING * `,[resUsers.rows[0].id,req.body.poll_title,voterUrl,adminUrl,req.body.poll_end_date,'2013-06-18'])
          .then((resPolls) => {
            // Insert options data into the options table
            for (let option of arrOptions) {
              db.query(`
              INSERT INTO options(poll_id,name)
              VALUES($1,$2)`,[resPolls.rows[0].id,option]);
              console.log(option);
            }
            //email function send
            let data = generateEmail(voterUrl, adminUrl, req.body.user_email);
            mg.messages().send(data, (error, body) => {
              console.log(body);
              console.log(error);
            // console.log(data);
            });
            response.redirect(`/polls/admin/${adminUrl}`);
          })
          .catch(err => {
            console.log(err)
              .status(500)
              .json({ error: err.message });
          });
      });
  });


  // route to show admin & voter links after poll creation
  router.get("/show/:id", (req, res) => {
    res.send("Links Here!");
  });

  // GET route to show poll admin results, THIS RETURNS JSON ONLY
  router.get("/admin/:admin_url/json", (req, res) => {
    const adminUrl = req.params.admin_url;

    db.query(`
      SELECT options.name as option, votes.rank, users.name as users_name
      FROM options JOIN polls ON polls.id = poll_id
      JOIN votes ON option_id = options.id
      JOIN users ON users.id = votes.user_id
      WHERE admin_URL = $1
      `, [adminUrl])
      .then(data => {
        const polls = data.rows;
        res.json({ polls });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // GET route to show poll admin results, renders the ejs template.
  router.get("/admin/:admin_url", (req, res) => {
    res.render('admin_url.ejs');
  });

  // route to vote on poll
  router.get("/voter/:voter_url", (req, res) => {
    getPollId(req.params.voter_url)
    .then(result => {
      poll_id = result.rows[0].id
      db.query(`select options.name, options.id, options.poll_id from options where options.poll_id = $1;`,[poll_id])
      .then(data => {
        const options = data.rows
        let templateVars = {poll_options: options}
         console.log(templateVars)
        res.render('voter_form',templateVars);
      })
    })
  });




  router.post("/:poll_id/vote", (req, res) => {
    let arrOptions = Object.values(req.body).splice(3);
    // Insert user (voter) into users table *** WRITE A SEPERATE FUNCTION FOR THIS ***
    db.query(`
    INSERT INTO users(name,email)
    VALUES($1,$2)
    RETURNING *`,[req.body.user_name,req.body.user_email])
      .then((resUsers) => {
      // Insert user's votes into the votes table

        for (let option of arrOptions) {
          db.query(`
        INSERT INTO votes(poll_id,option_id, user_id, rank)
        VALUES($1,$2,$3,$4) RETURNING * `,[req.params.poll_id, option.id, resUsers.rows[0].id, option.rank]);
          console.log("vote submited!");
        }
      });
  });

  return router;

};
