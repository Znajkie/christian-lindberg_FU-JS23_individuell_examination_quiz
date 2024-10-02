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

  const result = await db.scan(params);
  return result.Items;
}

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
    const quizId = event.queryStringParameters.quizId;
    console.log('quizId', quizId)
    const dbQuizzes = await getQuizById(quizId);

    return sendResponse({
      object: dbQuizzes,
    });
  });

module.exports = { handler };
