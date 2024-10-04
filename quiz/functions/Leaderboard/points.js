const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { middyTimeoutConfig } = require('../../services/middy');
const { validateToken } = require('../../middleware/auth');

const addPoints = async (event) => {
  try {
    const { username, quizId } = JSON.parse(event.body);

    // Check if the quizId exists in the QuizTable
    const quizData = await db
      .get({
        TableName: 'QuizTable',
        Key: {
          quizId: quizId,
        },
      })

    if (!quizData.Item) {
      return sendError(404, { message: 'Quiz not found.' });
    }

    // Check if the username exists in the UserTable
    const usernameData = await db
      .get({
        TableName: 'UserTable',
        Key: {
          username: username,
        },
      })

    if (!usernameData.Item) {
      return sendError(404, { message: 'User not found.' });
    }

    // Add a point to the ScoreTable for the given username and quizId
    await db
      .update({
        TableName: 'ScoreTable',
        Key: {
          username: username,
          quizId: quizId,
        },
        UpdateExpression:
          'SET points = if_not_exists(points, :start) + :increment',
        ExpressionAttributeValues: {
          ':increment': 1,
          ':start': 0,
        },
      })

    return sendResponse({ success: true });
  } catch (error) {
    console.error('Error adding point:', error);
    return sendError(500, { message: 'Internal server error.' });
  }
};

const handler = middy(middyTimeoutConfig).use(validateToken).handler(addPoints);

module.exports = { handler };
