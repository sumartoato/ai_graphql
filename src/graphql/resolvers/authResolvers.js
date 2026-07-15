const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../../config/database');
const config = require('../../config');

const SALT_ROUNDS = 12;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
}

const authResolvers = {
  Mutation: {
    register: async (_, { input }) => {
      const { name, email, password } = input;

      // Cek email sudah terdaftar
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE email = ?',
        [email],
      );
      if (existing.length > 0) {
        throw new Error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, 'user'],
      );

      const user = {
        id: result.insertId,
        name,
        email,
        role: 'user',
      };

      const token = signToken(user);

      return { token, user };
    },

    login: async (_, { input }) => {
      const { email, password } = input;

      const [rows] = await pool.query(
        'SELECT id, name, email, password, role, createdAt, updatedAt FROM users WHERE email = ?',
        [email],
      );

      if (rows.length === 0) {
        throw new Error('Invalid email or password');
      }

      const userRow = rows[0];
      const valid = await bcrypt.compare(password, userRow.password);

      if (!valid) {
        throw new Error('Invalid email or password');
      }

      const user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        createdAt: userRow.createdAt,
        updatedAt: userRow.updatedAt,
      };

      const token = signToken(user);

      return { token, user };
    },
  },
};

module.exports = authResolvers;
