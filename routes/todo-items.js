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
  const userId = req.session.userId;
  const category_name = req.body.category_name;
  const completed = req.body.completed;

  if (completed === undefined) { // only edit category, and don't toggle completed
    database.editTodoItemCategory(itemId, category_name, userId)
    .then(() => {
      res.redirect("/users/me");
    });
  } else { // only toggle completed
    database.editTodoItemCompleted(itemId, (completed==="true"), userId)
    .then(() => {
      res.send("edited database completed?");
    });
  }
});

// DELETE - delete todo item by ID (POST)
router.post("/:id/delete", (req, res) => {
  const itemId = req.params.id;
  const userId = req.session.userId;

  database.deleteTodoItem(itemId, userId)
  .then(() => {
    res.redirect("/users/me");
  });
});

module.exports = router;