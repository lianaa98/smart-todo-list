/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require('../db/connection');

// LOGIN (GET)
// router.get("/login", (req, res) => {
//   res.status(200).send({message: "test"});
// });

// LOGIN (POST)
router.post("/login", (req, res) => {
  database.getUserWithEmail(req.body.email)
    .then((user) => {
      // Error checking - e-mail / password not matching
      if (!user || !(req.body.password === user.password)) {
        res.status(401).send("Invalid e-mail / password.");
        return;
      }

      req.session.userID = user.id;
      res.send('Login successful!');
    })

});

router.get('/', (req, res) => {
  res.render('users');
}); 

module.exports = router;
