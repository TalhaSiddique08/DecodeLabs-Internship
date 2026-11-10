const { test, describe, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const prisma = require('../src/config/prisma');
const userController = require('../src/controllers/userController');
const errorHandler = require('../src/middleware/errorHandler');
const { Prisma } = require('@prisma/client');

describe('User Controller Unit Tests', () => {
  let req, res, next, statusCalledWith, jsonCalledWith, sendCalledWith;

  beforeEach(() => {
    statusCalledWith = null;
    jsonCalledWith = null;
    sendCalledWith = null;

    res = {
      status(code) {
        statusCalledWith = code;
        return this;
      },
      json(data) {
        jsonCalledWith = data;
        return this;
      },
      send(data) {
        sendCalledWith = data;
        return this;
      }
    };

    next = (err) => {
      if (err) {
        errorHandler(err, req, res, () => {});
      }
    };
  });

  test('createUser returns 201 and created user', async () => {
    const mockUser = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'newuser@example.com',
      age: 26,
      is_active: true,
      created_at: new Date()
    };

    prisma.user.create = async () => mockUser;

    req = {
      body: { email: 'newuser@example.com', age: 26, is_active: true }
    };

    await userController.createUser(req, res, next);

    assert.strictEqual(statusCalledWith, 201);
    assert.deepStrictEqual(jsonCalledWith, mockUser);
  });

  test('createUser returns 409 Conflict on duplicate email (P2002)', async () => {
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '6.4.1',
        meta: { target: ['email'] }
      }
    );

    prisma.user.create = async () => {
      throw prismaError;
    };

    req = {
      body: { email: 'duplicate@example.com', age: 22, is_active: true }
    };

    await userController.createUser(req, res, next);

    assert.strictEqual(statusCalledWith, 409);
    assert.strictEqual(jsonCalledWith.error, 'Email already exists');
  });

  test('getAllUsers returns 200 and list of users', async () => {
    const mockUsers = [
      { id: '1', email: 'u1@example.com', age: 20, is_active: true },
      { id: '2', email: 'u2@example.com', age: 30, is_active: false }
    ];

    prisma.user.findMany = async () => mockUsers;

    req = {};
    await userController.getAllUsers(req, res, next);

    assert.strictEqual(statusCalledWith, 200);
    assert.deepStrictEqual(jsonCalledWith, mockUsers);
  });

  test('getUserById returns 200 and user if found', async () => {
    const mockUser = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'found@example.com',
      age: 35,
      is_active: true
    };

    prisma.user.findUnique = async () => mockUser;

    req = { params: { id: mockUser.id } };
    await userController.getUserById(req, res, next);

    assert.strictEqual(statusCalledWith, 200);
    assert.deepStrictEqual(jsonCalledWith, mockUser);
  });

  test('getUserById returns 404 if user not found', async () => {
    prisma.user.findUnique = async () => null;

    req = { params: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' } };
    await userController.getUserById(req, res, next);

    assert.strictEqual(statusCalledWith, 404);
    assert.strictEqual(jsonCalledWith.error, 'User not found');
  });

  test('updateUser returns 200 and updated user', async () => {
    const existing = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'user@example.com',
      age: 25,
      is_active: true
    };
    const updated = { ...existing, age: 26 };

    prisma.user.findUnique = async () => existing;
    prisma.user.update = async () => updated;

    req = {
      params: { id: existing.id },
      body: { age: 26 }
    };

    await userController.updateUser(req, res, next);

    assert.strictEqual(statusCalledWith, 200);
    assert.deepStrictEqual(jsonCalledWith, updated);
  });

  test('updateUser returns 404 if user does not exist', async () => {
    prisma.user.findUnique = async () => null;

    req = {
      params: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      body: { age: 30 }
    };

    await userController.updateUser(req, res, next);

    assert.strictEqual(statusCalledWith, 404);
    assert.strictEqual(jsonCalledWith.error, 'User not found');
  });

  test('updateUser returns 409 if new email already exists in DB', async () => {
    const existing = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'user1@example.com',
      age: 25,
      is_active: true
    };
    const prismaError = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: '6.4.1',
        meta: { target: ['email'] }
      }
    );

    prisma.user.findUnique = async () => existing;
    prisma.user.update = async () => {
      throw prismaError;
    };

    req = {
      params: { id: existing.id },
      body: { email: 'alreadytaken@example.com' }
    };

    await userController.updateUser(req, res, next);

    assert.strictEqual(statusCalledWith, 409);
    assert.strictEqual(jsonCalledWith.error, 'Email already exists');
  });

  test('deleteUser returns 204 No Content when deleted', async () => {
    const existing = {
      id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
      email: 'delete@example.com',
      age: 28,
      is_active: true
    };

    prisma.user.findUnique = async () => existing;
    prisma.user.delete = async () => existing;

    req = { params: { id: existing.id } };
    await userController.deleteUser(req, res, next);

    assert.strictEqual(statusCalledWith, 204);
  });

  test('deleteUser returns 404 if user does not exist', async () => {
    prisma.user.findUnique = async () => null;

    req = { params: { id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' } };
    await userController.deleteUser(req, res, next);

    assert.strictEqual(statusCalledWith, 404);
    assert.strictEqual(jsonCalledWith.error, 'User not found');
  });
});

