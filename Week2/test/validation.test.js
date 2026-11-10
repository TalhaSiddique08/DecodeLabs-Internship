const { test, describe, before, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

describe('User API Validation & Route Tests', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  test('GET /health returns 200 OK', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'ok');
  });

  test('POST /users fails when email is missing (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 25, is_active: true })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Email is required');
  });

  test('POST /users fails when email is invalid (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email', age: 25, is_active: true })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid email format');
  });

  test('POST /users fails when age is missing (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', is_active: true })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Age is required');
  });

  test('POST /users fails when age is negative (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', age: -5, is_active: true })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Age must be greater than or equal to 0');
  });

  test('POST /users fails when age is a string or float (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', age: 25.5, is_active: true })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Age must be an integer');
  });

  test('POST /users fails when is_active is not boolean (400)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', age: 25, is_active: 'yes' })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'is_active must be a boolean');
  });

  test('GET /users/:id fails with invalid UUID format (400)', async () => {
    const res = await fetch(`${baseUrl}/users/123-not-a-uuid`);
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid user ID format. Expected a valid UUID.');
  });

  test('PUT /users/:id fails with invalid UUID format (400)', async () => {
    const res = await fetch(`${baseUrl}/users/invalid-id`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: 30 })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid user ID format. Expected a valid UUID.');
  });

  test('PUT /users/:id fails when body is empty (400)', async () => {
    const res = await fetch(`${baseUrl}/users/c4a169b1-789a-4e96-a947-f5dc81df3e01`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(
      data.error,
      'At least one field (email, age, is_active) must be provided for update'
    );
  });

  test('PUT /users/:id fails with negative age (400)', async () => {
    const res = await fetch(`${baseUrl}/users/c4a169b1-789a-4e96-a947-f5dc81df3e01`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age: -1 })
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Age must be greater than or equal to 0');
  });

  test('DELETE /users/:id fails with invalid UUID format (400)', async () => {
    const res = await fetch(`${baseUrl}/users/abc-xyz`, {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.error, 'Invalid user ID format. Expected a valid UUID.');
  });

  test('Returns 404 for undefined routes', async () => {
    const res = await fetch(`${baseUrl}/non-existent-route`);
    assert.strictEqual(res.status, 404);
  });
});
