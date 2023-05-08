const express = require('express');
const router = express.Router();
const database = require('../db/connection');

// BROWSE - Get Todo items (GET)
router.get("/", (req, res) => {
  
  const userId = req.session.userId;
  database.getAllTodoItems(userId)
    .then((todoItems) => {
      res.json(todoItems);
    });
});

// ADD - Add Todo item (POST)
router.post("/", (req, res) => {
  const todoItem = req.body;
  /* todoItem is an object like this: 
  {
    content,
    category_name,
    user_id
  } */
  console.log('todoItem:', todoItem);
  database
    .addTodoItem(todoItem)
    .then((todoItem) => {
      if (!todoItem) {
        return res.send({ error: "error" });
      }

      //
      res.send('Added!');
    })
    .catch((e) => res.send(e));
});

module.exports = router;