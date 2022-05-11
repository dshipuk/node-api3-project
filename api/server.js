const express = require('express');
const { 
  logger,
  validateUserId,
  validateUser,
  validatePost } = require("./middleware/middleware.js");
  
const server = express();

const usersRouter = require("./users/users-router")

server.use(express.json())

server.use(logger)

server.use("/api/users", usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

module.exports = server;
