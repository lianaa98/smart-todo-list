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
      console.log("todoItems:", todoItems);
      res.json(todoItems);
    });
});

// ADD - Add Todo item (POST)
// router.post("/", (req, res) => {
//   const todoItem = req.body;
//   todoItem.user_id = req.session.userId;
//   /* todoItem is an object like this: 
//   {
//     content,
//     category_name
//   } */
//   console.log('todoItem:', todoItem);
//   database
//     .addTodoItem(todoItem)
//     .then((todoItem) => {
//       if (!todoItem) {
//         return res.send({ error: "error" });
//       }

//       //
//       res.send('Added!');
//     })
//     .catch((e) => res.send(e));
// });

module.exports = router;