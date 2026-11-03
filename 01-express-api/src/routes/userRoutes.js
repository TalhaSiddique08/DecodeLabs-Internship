const express = require('express');
const router = express.Router();
const userStore = require('../data/userStore');
const { validateUserCreation, validateUserId } = require('../middleware/validation');

/**
 * GET /users
 * Retrieve all users in the in-memory collection.
 * Status: 200 OK
 */
router.get('/', (req, res) => {
  const users = userStore.getAll();
  return res.status(200).json(users);
});

/**
 * GET /users/:id
 * Retrieve a specific user by numeric ID.
 * Status: 200 OK on success, 404 Not Found if missing, 400 Bad Request if invalid ID.
 */
router.get('/:id', validateUserId, (req, res) => {
  const user = userStore.getById(req.userId);

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  return res.status(200).json(user);
});

/**
 * POST /users
 * Create a new user with name and email.
 * Status: 201 Created on success, 400 Bad Request on validation error.
 */
router.post('/', validateUserCreation, (req, res) => {
  const { name, email } = req.body;
  const createdUser = userStore.create({ name, email });
  return res.status(201).json(createdUser);
});

module.exports = router;
