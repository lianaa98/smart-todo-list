/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require('../db/connection');

// LOGIN (POST)
router.post("/login", (req, res) => {
  database.getUserWithEmail(req.body.email)
    .then((user) => {
      console.log(user);
      const templateVars = {
        user: user
      }

      // Error checking - e-mail / password not matching
      if (!user || !(req.body.password === user.password)) {
        res.status(401).send("Invalid e-mail / password.");
        return;
      }

      req.session.userId = user.id;
      res.render('user_index', templateVars);
    })

});

// REGISTER (POST)
router.post("/", (req, res) => {
  const user = req.body;
  database
    .addUser(user)
    .then((user) => {
      if (!user) {
        return res.send({ error: "error" });
      }

      req.session.userId = user.id;
      res.send("🤗"); // don't send user data here; make a different route (users/me) do the work of retrieving user data
    })
    .catch((e) => res.send(e));
});

// Return information about the current user (based on cookie value)
router.get("/me", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ message: "not logged in" });
  }

  database
    .getUserWithId(userId)
    .then((user) => {
      if (!user) {
        return res.send({ error: "no user with that id" });
      }

      res.send({
        user: {
          name: user.name,
          email: user.email,
          id: userId,
        },
      });
    })
    .catch((e) => res.send(e));
});

router.get('/', (req, res) => {
  res.render('users');
}); 

module.exports = router;
