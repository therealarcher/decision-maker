// Require express server
const express = require('express');
const router  = express.Router();
require('dotenv').config();

// Require mailgun module and associated key
const mailgun = require('mailgun-js');
const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});

// Require function to generate mailgun templates
const mailgunHelperFunctions = require('../public/scripts/mailgun');

module.exports = (db) => {

  // Helper Function to get PollId from voter URL
  const getPollId = function(voter_URL) {
    return db.query(
      `SELECT id
      FROM polls
      WHERE voter_url = $1;`, [voter_URL]
    );
  };

  // Helper Function to get poll information given the poll Id
  const getPollInfo = function(poll_id) {
    return db.query(
      `SELECT title, admin_url, voter_url, users.email as email
        FROM polls
        JOIN users on users.id = user_id
        WHERE polls.id = $1;`, [poll_id]
    ).then((res) => {
      return res.rows;
    });
  };

  // Helper Function to get poll information given the poll Id (url type is either admin_url or voter_url)
  const checkUrlExists = function(urlType, urlchecking) {
    return db.query(
      `SELECT $1
        FROM polls
        WHERE $1 = $2;`, [urlType, urlchecking]
    ).then((res) => {
      return res.rows;
    }).catch((err) => {
      return err;
    });
  };

  // Random string generator for URLs
  let generateRandomString = function() {
    return Math.random().toString(36).substring(2,8);
  };

  // ROUTES

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

  // Route to render Create New Poll Page
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
        INSERT INTO polls(user_id,title,voter_url,admin_url,end_date)
        VALUES($1,$2,$3,$4,$5) RETURNING * `,[resUsers.rows[0].id,req.body.poll_title,voterUrl,adminUrl,req.body.poll_end_date])
          .then((resPolls) => {
            // Insert options data into the options table
            for (let option of arrOptions) {
              db.query(`
              INSERT INTO options(poll_id,name)
              VALUES($1,$2)`,[resPolls.rows[0].id,option]);
              console.log(option);
            }
            //email function send
            let data = mailgunHelperFunctions.generatePollCreationEmail(voterUrl, adminUrl, req.body.user_email);
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
    const adminUrl = req.params.admin_url;
    checkUrlExists("admin_url", adminUrl).then((res) => {
      console.log(res);
    });
    res.render('admin_url.ejs');
  });

  // route to vote on poll
  router.get("/voter/:voter_url", (req, res) => {
    getPollId(req.params.voter_url)
      .then(result => {
        let poll_id = result.rows[0].id;
        db.query(`
        SELECT options.name, options.id, options.poll_id
        FROM options
        WHERE options.poll_id = $1;`,[poll_id])
          .then(data => {
            const options = data.rows;
            let templateVars = {poll_options: options};
            console.log(templateVars);
            res.render('voter_form',templateVars);
          });
      });
  });

  router.post("/:poll_id/vote", (req, res) => {
    let arrOptions = Object.values(req.body)[3];
    let poll_id = Object.values(req.body)[2];
    console.log(arrOptions);
    // Insert user (voter) into users table
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
        }
        // set variables to use in mailgun
        let voter_name = resUsers.rows[0].name;
        getPollInfo(poll_id).then((pollInfo) => {
          console.log(pollInfo);
          let poll_name = pollInfo[0].title;
          let creator_email = pollInfo[0].email;
          let admin_url = pollInfo[0].admin_url;
          let voter_url = pollInfo[0].voter_url;
          console.log(creator_email);
          // Mailgun notification to creator that someone has voted
          let data = mailgunHelperFunctions.generateVoteNotificationEmail(voter_name, poll_name, creator_email, admin_url, voter_url);
          mg.messages().send(data, (error, body) => {
            console.log(body);
            console.log(error);
          //  console.log(data);
          });
        });
      });
    res.redirect("/polls/voted");
  });

  // route to list all polls
  router.get("/voted", (req, res) => {
    res.send("Thanks for voting!");
  });

  return router;

};
