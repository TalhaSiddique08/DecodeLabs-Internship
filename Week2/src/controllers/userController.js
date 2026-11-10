const prisma = require('../config/prisma');

/**
 * Controller for User CRUD operations
 */

/**
 * POST /users
 * Create a new user
 */
async function createUser(req, res, next) {
  try {
    const { email, age, is_active } = req.body;

    const user = await prisma.user.create({
      data: {
        email,
        age,
        is_active: is_active !== undefined ? is_active : true
      }
    });

    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /users
 * Retrieve all users
 */
async function getAllUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        created_at: 'asc'
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /users/:id
 * Retrieve a specific user by ID
 */
async function getUserById(req, res, next) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /users/:id
 * Update an existing user
 */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { email, age, is_active } = req.body;

    // First check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Build update data object
    const updateData = {};
    if (email !== undefined) updateData.email = email;
    if (age !== undefined) updateData.age = age;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update user in PostgreSQL
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /users/:id
 * Delete a user by ID
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;

    // Check if user exists before deleting
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    // 204 No Content
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};

