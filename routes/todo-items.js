const express = require('express');
const router = express.Router();
const database = require('../db/connection');

// ROUTE: /todo-items

// BROWSE - Get Todo items (GET)
router.get("/", (req, res) => {
  
  const userId = req.session.userId;
  database.getAllTodoItems(userId)
    .then((todoItems) => {
      res.json(todoItems);
    });
});

// READ - Get Todo item category (GET)
router.get("/:category_name", (req, res) => {  
  const category_name = req.params.category_name;
  const userId = req.session.userId;
  database.getTodoItemsByCategory(userId, category_name)
    .then((todoItems) => {
      res.json(todoItems);
    });
});

// EDIT - edit todo item by ID (POST)
router.post("/:id", (req, res) => {
  const itemId = req.params.id;
  const category_name = req.body.category_name;
  const completed = req.body.completed;
  /* req.body is an object like this: 
  {
    category_name
  }
  or an object like this: 
  {
    completed
  } 
  where this edit route can do one or the other exclusively.
  */
  if (completed === undefined) { // only edit category, and don't toggle completed
    database.editTodoItemCategory(itemId, category_name)
    .then(() => {
      res.send("edited database category");
    });
  } else { // only toggle completed
    database.editTodoItemCompleted(itemId, (completed==="true"))
    .then(() => {
      res.send("edited database completed");
    });
  }
});


// EDIT - edit todo item by ID (POST)
router.post("/:id", (req, res) => {
  const itemId = req.params.id;
  const category_name = req.body.category_name;
  const completed = req.body.completed;
  /* req.body is an object like this: 
  {
    category_name
  }
  or an object like this: 
  {
    completed
  } 
  where this edit route can do one or the other exclusively.
  */
  if (completed === undefined) { // only edit category, and don't toggle completed
    database.editTodoItemCategory(itemId, category_name)
    .then(() => {
      res.send("edited database category");
    });
  } else { // only toggle completed
    database.editTodoItemCompleted(itemId, (completed==="true"))
    .then(() => {
      res.send("edited database completed");
    });
  }
});


// DELETE - delete todo item by ID (POST)
router.post("/:id/delete", (req, res) => {
  const itemId = req.params.id;
  /* req.body is an object like this: 
  {
    category_name
  }
  or an object like this: 
  {
    completed
  } 
  where this edit route can do one or the other exclusively.
  */
  if (completed === undefined) { // only edit category, and don't toggle completed
    database.editTodoItemCategory(itemId, category_name)
    .then(() => {
      res.send("edited database category");
    });
  } else { // only toggle completed
    database.editTodoItemCompleted(itemId, (completed==="true"))
    .then(() => {
      res.send("edited database completed");
    });
  }
});

module.exports = router;