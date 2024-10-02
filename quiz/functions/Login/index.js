const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const { db } = require('../../services/db');
const { sendResponse, sendError } = require('../../responses/index');
const { getUser } = require('../../helpers/userHelper');
require('dotenv').config();

async function checkPassword(password, user) {
  const isCorrect = await bcrypt.compare(password, user.hashedPassword);
  return isCorrect;
}

function signToken(user) {
  const token = jwt.sign({ username: user.username }, process.env.SECRET, {
    expiresIn: 3600, // Går ut om 60 min
  });

  return token;
}

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  const user = await getUser(username);
  const correctPassword = await checkPassword(password, user);

  if (!correctPassword) return sendError(401, 'Wrong username or password');

  const token = signToken(user);

  return sendResponse({ success: true, token: token });
};
