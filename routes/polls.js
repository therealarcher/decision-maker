const express = require('express');
const router  = express.Router();


module.exports = (db) => {

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
    res.send("Create a new poll here");
  });

  // route to submit poll
  router.post("/", (req, res) => {
    res.send("Send email to creator, submit poll to database");
  });

  // route to show admin & voter links after poll creation
  router.get("/show/:id", (req, res) => {
    res.send("Links Here!");
  });

  // route to show poll results,
  router.get("/admin/:admin_url", (req, res) => {

    // if (filterURLs(urlDatabase, req)[req.params.shortURL]) {
    //   urlDatabase[req.params.shortURL].longURL = req.body.longURL;
    //   res.redirect('/urls');
    // } else {
    //   res.statusCode = 403;
    //   let templateVars = { urls: urlDatabase, user: users[req.session.user_id], errorStatusCode: res.statusCode, errorMessage: "Forbbiden! You shall not pass." };
    //   res.render("urls_error", templateVars);

    console.log('params:',req.params);
    const adminUrl = req.params.admin_url;
    db.query(`
      SELECT options.name, COUNT(votes.id)
      FROM options JOIN polls ON polls.id = poll_id
      JOIN votes ON option_id = options.id
      WHERE admin_URL = '${adminUrl}'
      GROUP BY options.name;
      `)
      .then(data => {
        const polls = data.rows;
        console.log('polls:',polls, 'polls is:', polls.typeOf);
        let templateVars = {pollOptions: polls};
        res.render("admin_url.ejs", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // route to vote on poll
  router.get("/voter/:voter_url", (req, res) => {
    res.send("Voter page");
  });


  // route to vote on poll
  router.post("/:voter_url", (req, res) => {
    res.send("submit vote");
  });

  return router;

};
