// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(cookieSession({
  name: 'session',
  keys: ['secretkey1', 'secondsecretkey2'],
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  // When user is logged in (has cookie)

  // When user is logged out
  /* const templateVars = {
    user: users[req.session.userID],
  };
  res.render("urls_registration", templateVars); */
  res.render('index');
});

const findUserFromEmail = (email) => {
  return pool
    .query(`SELECT *
    FROM users
    WHERE email = $1;`, [email])
    .then((result) => {

      // Invalid email
      if (result.rows.length === 0) {
        console.log('invalid query', result.rows);
        return null;
      }

      // email found
      console.log('query', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// LOGIN (POST)
app.post("/login", (req, res) => {
  const user = findUserFromEmail(req.body.email, users);

  // Error checking - e-mail / password not matching
  if (!user || !bcrypt.compareSync(req.body.password, user.hashedPassword)) {
    res.status(401).send("Invalid e-mail / password.");
    return;
  }

  req.session.userID = user.id;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
