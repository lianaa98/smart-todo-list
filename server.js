// load .env data into process.env
require('dotenv').config();

// Web server and database config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const database = require('./db/connection');

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
const todoItemsRoutes = require('./routes/todo-items');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
app.use('/todo-items', todoItemsRoutes);
// Note: mount other resources here, using the same pattern above

//=======================
//     HOME PAGE        ||
//=======================

// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  const userId = req.session.userId;
  const templateVars = {};
  templateVars.showIndex = `<script defer src="/scripts/index_loggedin.js"></script>`;

  // When user is logged out
  if (!userId) {
    // Direct to the login page
    console.log('Logged out');
    templateVars.showIndex = `<script defer src="/scripts/index_loggedout.js"></script>`;
    res.render('index', templateVars);
    return;
  }

  // When user is logged in (has cookie)
  database
    .getUserWithId(userId)
    .then((user) => {
      if (!user) {
        return res.send({ error: "no user with that id" });
      }

      templateVars.username = user.name;

      res.render('index', templateVars);
    })
    .catch((e) => res.send(e));
  
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
