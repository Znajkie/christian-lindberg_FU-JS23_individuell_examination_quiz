const { db } = require('../../services/db');
const middy = require('@middy/core')
const { validateToken } = require('../../middleware/auth');
const { sendResponse } = require('../../responses/index');
const { middyTimeoutConfig } = require('../../services/middy');

async function getAllQuizzes() {
  const params = {
    TableName: 'QuizTable',
  };

  const result = await db.scan(params);
  return result.Items;
}

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
  const dbQuizzes = await getAllQuizzes();

  return sendResponse({
    object: dbQuizzes,
  });
})


module.exports = { handler };
