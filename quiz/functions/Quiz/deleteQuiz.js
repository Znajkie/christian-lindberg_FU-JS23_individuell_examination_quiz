const { db } = require('../../services/db');
const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { sendResponse } = require('../../responses/index');
const { middyTimeoutConfig } = require('../../services/middy');

async function deleteQuizById(quizId) {
  const params = {
    TableName: 'QuizTable',
    Key: {
      quizId: quizId,
    },
  };

  await db.delete(params);
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

    await deleteQuizById(quizId);

    return sendResponse({
      statusCode: 200,
      message: 'Quiz deleted successfully',
    });
  });

module.exports = { handler };
