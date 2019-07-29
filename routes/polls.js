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

  // GET route to show poll admin results, THIS RETURNS JSON ONLY
  router.get("/admin/:admin_url/json", (req, res) => {
    const adminUrl = req.params.admin_url;
    db.query(`
      SELECT options.name, COUNT(votes.id), polls.title
      FROM options JOIN polls ON polls.id = poll_id
      JOIN votes ON option_id = options.id
      WHERE admin_URL = $1
      GROUP BY options.name, polls.title;
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
    res.send("Voter page");
  });

  // route to vote on poll
  router.post("/:voter_url", (req, res) => {
    res.send("submit vote");
  });

  return router;

};
