const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { middyTimeoutConfig } = require('../../services/middy');
const { validateToken } = require('../../middleware/auth');
const { v4: uuidv4 } = require('uuid');


const createQuiz = async (event) => {
  try {
    const { name } = JSON.parse(event.body);
    const quizId = uuidv4()
    const username = event.username;
    
    await db.put({
      TableName: 'QuizTable',
      Item: {
        name: name,
        username: username,
        quizId: quizId,
        questions: [],
      }
    })
    console.log('Quiz created:', quizId);
    return sendResponse({ success: true });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return sendError(500, { message: 'Internal server error.' });
  }
};


const handler = middy(middyTimeoutConfig).use(validateToken).handler(createQuiz);

module.exports = { handler };