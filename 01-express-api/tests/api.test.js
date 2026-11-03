const { describe, it, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const userStore = require('../src/data/userStore');

describe('Express.js User Management API Test Suite', () => {
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

  beforeEach(() => {
    userStore.reset();
  });

  // Test 1: Check root endpoint
  it('1. GET / - Root endpoint returns 200 OK and confirmation message', async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.status, 'ok');
    assert.ok(body.message.includes('Express.js'));
  });

  // Test 2: Retrieve users when empty
  it('2. GET /users - Returns 200 OK and empty array [] when store is empty', async () => {
    const res = await fetch(`${baseUrl}/users`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, []);
  });

  // Test 3: Create a valid user
  it('3. POST /users - Creates a valid user and returns 201 Created', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aisha', email: 'aisha@example.com' }),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.id, 1);
    assert.strictEqual(body.name, 'Aisha');
    assert.strictEqual(body.email, 'aisha@example.com');
  });

  // Test 4: Retrieve an existing user
  it('4. GET /users/:id - Returns 200 OK and the user object if found', async () => {
    const createRes = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aisha', email: 'aisha@example.com' }),
    });
    const created = await createRes.json();

    const res = await fetch(`${baseUrl}/users/${created.id}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.deepStrictEqual(body, {
      id: 1,
      name: 'Aisha',
      email: 'aisha@example.com',
    });
  });

  // Test 5: Retrieve a nonexistent user
  it('5. GET /users/:id - Returns 404 Not Found when user does not exist', async () => {
    const res = await fetch(`${baseUrl}/users/999`);
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error, 'User not found');
  });

  // Test 6: Create a user without a name (missing or whitespace)
  it('6. POST /users - Rejects creation without name (returns 400 Bad Request)', async () => {
    // Missing name
    const res1 = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'aisha@example.com' }),
    });
    assert.strictEqual(res1.status, 400);
    const body1 = await res1.json();
    assert.ok(body1.error.includes('name'));

    // Blank whitespace-only name
    const res2 = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '   ', email: 'aisha@example.com' }),
    });
    assert.strictEqual(res2.status, 400);
    const body2 = await res2.json();
    assert.ok(body2.error.includes('name'));
  });

  // Test 7: Create a user without an email
  it('7. POST /users - Rejects creation without email (returns 400 Bad Request)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aisha' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes('email'));
  });

  // Test 8: Create a user with an invalid email
  it('8. POST /users - Rejects creation with invalid email format (returns 400 Bad Request)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aisha', email: 'not-an-email' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.includes('valid email'));
  });

  // Test 9: Send malformed JSON
  it('9. POST /users - Rejects malformed JSON body (returns 400 Bad Request)', async () => {
    const res = await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"name": "Aisha", email: malformed}',
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.error.toLowerCase().includes('json') || body.error.toLowerCase().includes('malformed'));
  });

  // Test 10: Create multiple users and verify unique auto-incrementing IDs
  it('10. POST /users - Multiple creations assign unique sequential IDs', async () => {
    const u1 = await (await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Aisha', email: 'aisha@example.com' }),
    })).json();

    const u2 = await (await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bilal', email: 'bilal@example.com' }),
    })).json();

    const u3 = await (await fetch(`${baseUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Chirag', email: 'chirag@example.com' }),
    })).json();

    assert.strictEqual(u1.id, 1);
    assert.strictEqual(u2.id, 2);
    assert.strictEqual(u3.id, 3);
    assert.notStrictEqual(u1.id, u2.id);
    assert.notStrictEqual(u2.id, u3.id);

    const listRes = await fetch(`${baseUrl}/users`);
    const allUsers = await listRes.json();
    assert.strictEqual(allUsers.length, 3);
  });
});
