const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { sendResponse } = require('../../responses/index');
const { middyTimeoutConfig } = require('../../services/middy');

async function getQuizById(quizId) {
  const params = {
    TableName: 'QuizTable',
    KeyConditionExpression: 'quizId = :quizId',
    ExpressionAttributeValues: {
      ':quizId': quizId,
    },
  };

  const result = await db.query(params);
  return result.Items.length > 0 ? result.Items[0] : null;
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

    const dbQuiz = await getQuizById(quizId);

    if (!dbQuiz) {
      return sendResponse({
        statusCode: 404,
        message: 'Quiz not found',
      });
    }

    return sendResponse({
      object: dbQuiz,
    });
  });

module.exports = { handler };
