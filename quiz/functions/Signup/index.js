const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
require('dotenv').config();

async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

exports.handler = async (event) => {
  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return sendError(400, { message: 'Username and password are required.' });
    }

    const hashedPassword = await hashPassword(password);

    await db.put({
      TableName: 'UserTable',
      Item: {
        username,
        hashedPassword,
      },
    });

    return sendResponse({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return sendError(500, { message: 'Internal server error.' });
  }
};
