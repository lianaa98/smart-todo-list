// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = new Pool(dbParams);

db.connect();

const getUserWithEmail = (email) => {
  return db
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

const getUserWithId = function(id) {
  return db
    .query(`SELECT *
    FROM users
    WHERE id = $1;`, [id])
    .then((result) => {

      // Invalid id
      if (result.rows.length === 0) {
        console.log('invalid query for id', result.rows);
        return null;
      }

      // id found
      console.log('query for id', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addUser = function(user) {
  return db
    .query(`INSERT INTO users (name, email, password)
    VALUES ($1, $2, $3)
    RETURNING *;`, [user.name, user.email, user.password])
    .then((result) => {
      // Invalid insertion
      if (result.rows.length === 0) {
        console.log('invalid query for insertion', result.rows);
        return null;
      }

      // valid insertion
      console.log('query for insertion', result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const addTodoItem = function(todoObj) {
  return db.query(`SELECT id FROM categories WHERE categories.name = $1;`, [todoObj.category_name]).then((result) => {
    let category_name = '';

    // invalid/empty query
    if (result.rows.length === 0) {
      console.log('invalid/empty category; setting default', result.rows);
      category_name = 'others';
    }
    else {
      // valid query
      console.log('query', result.rows[0]);
      category_name = todoObj.category_name;
    }

    db.query(`INSERT INTO things (content, category_id, user_id, created_at)
    VALUES ($1, (SELECT id FROM categories WHERE categories.name = $2), $3, Now())
    RETURNING *;`, [todoObj.content, category_name, todoObj.user_id])
      .then((result) => {
        // Invalid insertion
        if (result.rows.length === 0) {
          console.log('invalid query for insertion', result.rows);
          return null;
        }

        // valid insertion
        console.log('query for insertion', result.rows[0]);
        return result.rows[0];
      })
      .catch((err) => {
        console.log('error:', err.message);
      });
    return result.rows;
  })
    .catch((err) => {
      console.log('error:', err.message);
    });
};

const getTodoItemsByCategory = (user_id, category_name) => {
  return db
    .query(`SELECT things.id, content, categories.name AS category_name, created_at
    FROM things
    LEFT JOIN categories ON category_id = categories.id
    WHERE user_id = $1
    AND category_id = (SELECT id FROM categories WHERE categories.name = $2)
    ORDER BY created_at;`, [user_id, category_name])
    .then((result) => {
      // valid query
      console.log('query', result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const getAllTodoItems = (user_id) => {
  return db
    .query(`SELECT things.id, content, categories.name AS category_name, created_at
    FROM things
    LEFT JOIN categories ON category_id = categories.id
    WHERE user_id = $1
    ORDER BY created_at;`, [user_id])
    .then((result) => {

      // invalid/empty query
      if (result.rows.length === 0) {
        console.log('invalid/empty query', result.rows);
        return null;
      }

      // valid query
      console.log('query', result.rows);
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const editTodoItemCompleted = function(itemId, completed, userId) {
  let completedParam = '';
  if (completed) {
    completedParam = 'Now()';
  } else {
    completedParam = 'null';
  }
  return db.query(`
  UPDATE things
  SET completed_at = ${completedParam}
  WHERE things.id = $1
  AND user_id = $2;
  `, [itemId, userId]) // no sql injection expected from this due to value of completedParam being set by the backend code, not user input
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });
};

const editTodoItemCategory = function(itemId, category_name, userId) {
  return db.query(`
  UPDATE things
  SET category_id = (SELECT id FROM categories WHERE categories.name = $1)
  WHERE things.id = $2
  AND user_id = $3;
  `, [category_name, itemId, userId])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });
};

const deleteTodoItem = function(itemId, userId) {
  return db.query(`
  DELETE FROM things
  WHERE things.id = $1
  AND user_id = $2;
  `, [itemId, userId])
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log('error:', err.message);
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  addTodoItem,
  getAllTodoItems,
  getTodoItemsByCategory,
  editTodoItemCategory,
  editTodoItemCompleted,
  deleteTodoItem,
};
