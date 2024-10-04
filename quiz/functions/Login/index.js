const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const { sendResponse, sendError } = require('../../responses/index');
const { getUser } = require('../../helpers/userHelper');
const { middyTimeoutConfig } = require('../../services/middy');
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

const loginHandler = async (event) => {
  const { username, password } = JSON.parse(event.body);
  const user = await getUser(username);
  const correctPassword = await checkPassword(password, user);

  if (!correctPassword) return sendError(401, 'Wrong username or password');

  const token = signToken(user);
  console.log('Logged in:', user.username);
  console.log('Token:', token);
  return sendResponse({ success: true, token: token, username: user.username });
};

exports.handler = middy(middyTimeoutConfig).handler(loginHandler);
