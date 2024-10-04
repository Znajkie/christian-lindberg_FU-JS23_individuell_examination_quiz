const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { sendResponse } = require('../../responses/index');
const { middyTimeoutConfig } = require('../../services/middy');

async function getLeaderboard(quizId) {
  const params = {
    TableName: 'ScoreTable',
    KeyConditionExpression: 'quizId = :quizId',
    ExpressionAttributeValues: {
      ':quizId': quizId,
    },
  };

  const result = await db.query(params);
  return result.Items;
}

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
    const quizId = event.pathParameters && event.pathParameters.quizId;
    console.log('quizId', quizId);

    if (!quizId) {
      return sendResponse({
        statusCode: 400,
        message: 'quizId is required',
      });
    }

    const leaderboard = await getLeaderboard(quizId);

    if (!leaderboard || leaderboard.length === 0) {
      return sendResponse({
        statusCode: 404,
        message: 'Leaderboard not found',
      });
    }

    return sendResponse({
      statusCode: 200,
      data: leaderboard,
    });
  });

module.exports = { handler };
