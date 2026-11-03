/**
 * In-memory user data store.
 * Holds user records in memory. Resets when server restarts.
 */

class UserStore {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  /**
   * Retrieve all users.
   * @returns {Array<{id: number, name: string, email: string}>}
   */
  getAll() {
    return [...this.users];
  }

  /**
   * Find a user by their numeric ID.
   * @param {number} id
   * @returns {{id: number, name: string, email: string} | null}
   */
  getById(id) {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  /**
   * Create and store a new user.
   * @param {{name: string, email: string}} data
   * @returns {{id: number, name: string, email: string}}
   */
  create({ name, email }) {
    const newUser = {
      id: this.nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  /**
   * Reset the store (useful for automated testing).
   */
  reset() {
    this.users = [];
    this.nextId = 1;
  }
}

// Export singleton instance
const userStore = new UserStore();
module.exports = userStore;
