DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS things CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
--DROP TABLE IF EXISTS importances CASCADE; --stretch

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  default_profile_img INTEGER NOT NULL DEFAULT 1,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE things (
  id SERIAL PRIMARY KEY NOT NULL,
  content TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP,
  completed_at TIMESTAMP
  --importance_id INTEGER REFERENCES importances(id) ON DELETE CASCADE, --stretch
);