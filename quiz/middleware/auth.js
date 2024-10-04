const jwt = require('jsonwebtoken');
require('dotenv').config();

const validateToken = {
  before: async (request) => {
    try {
      const authHeader = request.event.headers.authorization;

      if (!authHeader) {
        throw new Error('Unauthorized');
      }

      const token = authHeader.replace('Bearer ', '');

      if (!token) {
        throw new Error('Unauthorized');
      }

      const data = jwt.verify(token, process.env.SECRET);
      request.event.username = data.username;
    } catch (error) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized, no valid token' }),
      };
    }
  },
};

module.exports = { validateToken };