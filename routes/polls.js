const express = require('express');
const router  = express.Router();

// all route will start with /polls/...

module.exports = () => {

  // route to list all polls
  router.get("/", (req, res) => {
    res.send("Hello! This page will list all the polls");
  });

  // route to create a new poll
  router.get("/new", (req, res) => {
    res.render("new_poll");
  });

  // route to submit poll
  router.post("/", (req, res) => {
    console.log("this worked!")
    res.send("Send email to creator, submit poll to database");
  });

  // route to show poll results,
  // router.get("/:admin_url", (req, res) => {
  //   res.send("Send email to creator, submit poll to database");
  // });

  // route to show admin & voter links after poll creation
  router.get("/show/:id", (req, res) => {
    res.send("Links Here!");
  });

  // route to show poll results,
  router.get("/admin/:admin_url", (req, res) => {
    console.log('params:',req.params);
    res.send("Send email to creator, submit poll to database");
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
