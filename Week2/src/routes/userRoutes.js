const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {
  validateUserId,
  validateCreateUser,
  validateUpdateUser
} = require('../middleware/validation');

// User CRUD routes
router.post('/', validateCreateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', validateUserId, userController.getUserById);
router.put('/:id', validateUserId, validateUpdateUser, userController.updateUser);
router.delete('/:id', validateUserId, userController.deleteUser);

module.exports = router;

