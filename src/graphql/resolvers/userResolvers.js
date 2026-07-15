const bcrypt = require('bcrypt');
const pool = require('../../config/database');

const SALT_ROUNDS = 12;

const userResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error('Authentication required');

      const [rows] = await pool.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM users WHERE id = ?',
        [user.id],
      );
      return rows[0] || null;
    },

    user: async (_, { id }) => {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM users WHERE id = ?',
        [id],
      );
      return rows[0] || null;
    },

    users: async (_, { page, limit }, { user: authUser }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const offset = (page - 1) * limit;

      const [countResult] = await pool.query(
        'SELECT COUNT(*) as total FROM users',
      );
      const total = countResult[0].total;

      const [rows] = await pool.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?',
        [limit, offset],
      );

      return { data: rows, total, page, limit };
    },
  },

  Mutation: {
    createUser: async (_, { input }, { user: authUser }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const { name, email, password, role } = input;

      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email],
      );
      if (existing.length > 0) {
        throw new Error('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const userRole = role || 'user';

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, userRole],
      );

      return {
        id: result.insertId,
        name,
        email,
        role: userRole,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    },

    updateUser: async (_, { id, input }, { user: authUser }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const fields = [];
      const values = [];

      if (input.name) {
        fields.push('name = ?');
        values.push(input.name);
      }
      if (input.email) {
        fields.push('email = ?');
        values.push(input.email);
      }
      if (input.password) {
        const hashed = await bcrypt.hash(input.password, SALT_ROUNDS);
        fields.push('password = ?');
        values.push(hashed);
      }
      if (input.role) {
        fields.push('role = ?');
        values.push(input.role);
      }

      if (fields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(id);

      await pool.query(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );

      const [rows] = await pool.query(
        'SELECT id, name, email, role, createdAt, updatedAt FROM users WHERE id = ?',
        [id],
      );
      return rows[0] || null;
    },

    deleteUser: async (_, { id }, { user: authUser }) => {
      if (!authUser || authUser.role !== 'admin') {
        throw new Error('Admin access required');
      }

      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    },
  },
};

module.exports = userResolvers;
