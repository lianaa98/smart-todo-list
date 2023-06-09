/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require('../db/connection');

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

router.post('/', async (req, res) => {
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
    })
    .catch((err) => res.send(err));

  const plaintext = req.body.thing;

  const apiResponse = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `The category of '${plaintext}' is 'to-watch', 'to-read', 'to-eat' or 'to-buy':`,
    max_tokens: 7,
    temperature: 0,
  })

  const formattedResp = apiResponse.data.choices[0].text.trim().toLowerCase();

  let output = '';
  const includesWordAndOutput = {
    'watch': 'to-watch',
    'read': 'to-read',
    'eat': 'to-eat',
    'buy': 'to-buy',
  };
  for (const includesWord in includesWordAndOutput) {
    if (formattedResp.includes(includesWord)) {
      output = includesWordAndOutput[includesWord];
    }
  }

  const newToDoThing = {
    content: plaintext,
    category_name: output,
    user_id: userId
  }
  
  database.addTodoItem(newToDoThing).then((result) => {  
    return res.status(200).send("added!");
  })
});

module.exports = router;
