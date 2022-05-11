const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost
} = require("../middleware/middleware");

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const User = require("./users-model")
const Post = require("../posts/posts-model")


const router = express.Router();

router.get('/', (req, res, next) => {
  User.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user)
});

router.post('/', validateUser, (req, res, next) => {
  User.insert({ name: req.name })
    .then(newUser => {
      res.status(201).json(newUser)
    })
    .catch(next)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  User.update(req.params.id, { name: req.name })
    .then( () => {
      return User.getById(req.params.id)
    })
    .then(user => {
      res.status(201).json(user)
    })
    .catch(next)
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, (req, res, next) => {
  User.getUserPosts(req.params.id)
    .then(posts => {
      res.json(posts)
    })
    .catch(next)
});

router.post('/:id/posts', validateUserId, validatePost, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  Post.insert({
    user_id: req.params.id,
    text: req.text
  })
    .then(result => {
      res.status(201).json(result)
    })
    .catch(next)
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    customMessage: "Something tragic inside posts router happened",
    message: err.message,
    stack: err.stack
  })
})

// do not forget to export the router
module.exports = router;