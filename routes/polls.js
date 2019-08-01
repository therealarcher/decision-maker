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
      `SELECT id, title
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
  const checkAdminUrlExists = function(urlchecking) {
    console.log(urlchecking);
    return db.query(
      `SELECT admin_url
        FROM polls
        WHERE admin_url = $1;`, [urlchecking]
    ).then((res) => {
      console.log(res.rows);
      return res.rows;
    });
  };

  // Helper Function to get poll information given the poll Id (url type is either admin_url or voter_url)
  const checkVoterUrlExists = function(urlchecking) {
    console.log('voterUrl:', urlchecking);
    return db.query(
      `SELECT voter_url
        FROM polls
        WHERE voter_url = $1;`, [urlchecking]
    ).then((res) => {
      console.log(res.rows);
      return res.rows;
    });
  };

  // Helper Function to check if a user has already voted
  const hasAlreadyVoted = function(email, poll_id) {
    return db.query(
      `SELECT user_id
        FROM votes
        JOIN users ON users.id = user_id
        WHERE users.email = $1
        AND votes.poll_id = $2`, [email, poll_id]
    ).then((res) => {
      console.log(res.rows);
      return res.rows;
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

  // Route to render "Create New Poll" Page
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  // Route Handler to create a new poll
  router.post("/", (req, response) => {

    let arrOptions = Object.values(req.body).splice(5);
    console.log("request body", req.body);
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
            // Mailgun function to send an email to poll creator with voter & administrator links
            let data = mailgunHelperFunctions.generatePollCreationEmail(voterUrl, adminUrl, req.body.user_email);
            mg.messages().send(data, (error, body) => {
            });
            response.redirect('/polls/created');
          })
          .catch(err => {
            console.log(err)
              .status(500)
              .json({ error: err.message });
          });
      });
  });


  // route to show admin & voter links after poll creation
  router.get("/created", (req, res) => {
    res.render("poll_created");
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
    checkAdminUrlExists(adminUrl).then((response) => {
      console.log("admin url:", response);
      if (response.length === 0) {
        res.render('error_template');
      } else {
        res.render('admin_url.ejs');
      }
    });

  });

  // route to vote on poll
  router.get("/voter/:voter_url", (req, res) => {
    const voterUrl = req.params.voter_url;
    // Check for url in the database
    checkVoterUrlExists(voterUrl).then((response) => {
      // if url doesn't exist, render
      if (response.length === 0) {
        res.render('error_template');
      } else {
        getPollId(req.params.voter_url)
          .then(result => {
            let poll_id = result.rows[0].id;
            let poll_title = result.rows[0].title
            db.query(`
          SELECT options.name, options.id, options.poll_id
          FROM options
          WHERE options.poll_id = $1;`,[poll_id])
              .then(data => {
                const options = data.rows;
                let templateVars = {poll_options: options, title: poll_title};
                console.log(templateVars);
                res.render('voter_form',templateVars);
              });
          });
      }
    });
  });

  // Route handler for when a user submits their vote
  router.post("/:poll_id/vote", (req, res) => {
    console.log(req.body);

    let arrOptions = Object.values(req.body)[3];
    console.log(arrOptions);
    let poll_id = Object.values(req.body)[2];

    hasAlreadyVoted(req.body.user_email, poll_id,).then((response) => {
      if (response.length === 0) {
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
      } else {
        res.send("ERROR! YOU HAVE ALREADY VOTED");
      }
    });
  });

  // Route Handler for landing page that voter is redirected to after they vote
  router.get("/voted", (req, res) => {
    res.render('voted');
  });

  return router;

};
