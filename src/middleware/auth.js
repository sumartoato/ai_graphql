const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Extract user dari JWT token di header Authorization.
 * Dipanggil di context Apollo Server setiap request.
 */
function authenticateUser(req) {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];

  try {
    return jwt.verify(token, config.jwt.secret);
  } catch {
    return null;
  }
}

module.exports = { authenticateUser };
