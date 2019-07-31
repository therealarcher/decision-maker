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
    html:`
    <!DOCTYPE html>
<html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
<head>
<meta name="viewport" content="width=device-width" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Actionable emails e.g. reset password</title>
​
​
<style type="text/css">
img {
max-width: 100%;
}
body {
-webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;
}
body {
background-color: #f6f6f6;
}
@media only screen and (max-width: 640px) {
  body {
    padding: 0 !important;
  }
  h1 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h2 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h3 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h4 {
    font-weight: 800 !important; margin: 20px 0 5px !important;
  }
  h1 {
    font-size: 22px !important;
  }
  h2 {
    font-size: 18px !important;
  }
  h3 {
    font-size: 16px !important;
  }
  .container {
    padding: 0 !important; width: 100% !important;
  }
  .content {
    padding: 0 !important;
  }
  .content-wrap {
    padding: 10px !important;
  }
  .invoice {
    width: 100% !important;
  }
}
</style>
</head>
​
<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
​
<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
    <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
      <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
        <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
              <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    Thank you for creating a poll with Decidr!  We will help you make a decision with confidence.
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    Your personal administrator link is:<br>
                    <br>
                    <a href="http://localhost:8080/polls/admin/${admin_url}">View Results</a><br>
                    <br>
                    Voter url is:<br>
                    <br>
                    <a href="http://localhost:8080/polls/voter/${voter_url}">Vote Here</a><br>
                    <br>
                    <a href="http://localhost:8080/polls/voter/${voter_url}">http://localhost:8080/polls/voter/${voter_url}</a><br>
                    It's up to you to send this voter link to those who you want to include in the voting process!<br>
                    <br>
                    Come back to your administrator link anytime to view the results of the poll.
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" itemprop="handler" itemscope itemtype="http://schema.org/HttpActionHandler" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    <a href="http://www.mailgun.com" class="btn-primary" itemprop="url" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; color: #FFF; text-decoration: none; line-height: 2em; font-weight: bold; text-align: center; cursor: pointer; display: inline-block; border-radius: 5px; text-transform: capitalize; background-color: #348eda; margin: 0; border-color: #348eda; border-style: solid; border-width: 10px 20px;">Poll Results</a>
                  </td>
                </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
                    &mdash; The friendly folk at Decidr
                  </td>
                </tr></table></td>
          </tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
          {{!--<table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">Follow <a href="http://twitter.com/mail_gun" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Mail_Gun</a> on Twitter.</td>--}}
          {{!--  </tr></table>--}}
            </div></div>
    </td>
    <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
  </tr></table></body>
</html>` 
    
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
        poll_id = result.rows[0].id;
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
    let arrOptions = Object.values(req.body).splice(3);
    // Insert user (voter) into users table
    db.query(`
    INSERT INTO users(name,email)
    VALUES($1,$2)
    RETURNING *`,[req.body.user_name,req.body.user_email])
      .then((resUsers) => {
        // Insert user's votes into the votes table
        for (let option of arrOptions[0]) {
          console.log('poll_id:',req.params.poll_id, 'option_id:', option.id, 'user_id:', resUsers.rows[0].id, 'rank', option.rank);
          db.query(`
        INSERT INTO votes(poll_id,option_id, user_id, rank)
        VALUES($1,$2,$3,$4) RETURNING * `,[req.params.poll_id, option.id, resUsers.rows[0].id, option.rank]);
        }
        //ADD MAIL GUN FUNCTION
        res.redirect("/polls/voted");
      });
  });


  // route to list all polls
  router.get("/voted", (req, res) => {
    res.send("Thanks for voting!")
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });




  return router;

};
