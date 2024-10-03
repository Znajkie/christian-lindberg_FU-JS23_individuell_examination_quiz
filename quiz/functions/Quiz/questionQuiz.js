const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');
const middy = require('@middy/core');
const { middyTimeoutConfig } = require('../../services/middy');
const { validateToken } = require('../../middleware/auth');

const addQuestion = async (event) => {
  try {
    const { name, quizId, question, answer, longitude, latitude } = JSON.parse(
      event.body
    );

    // Fetch the existing quiz by ID
    const quizData = await db.get({
      TableName: 'QuizTable',
      Key: {
        quizId: quizId,
      },
    });

    if (!quizData.Item) {
      return sendError(404, { message: 'Quiz not found.' });
    }

    // Add the new question to the existing questions array
    const newQuestion = {
      name: name,
      question: question,
      answer: answer,
      location: {
        longitude: longitude,
        latitude: latitude,
      },
    };

    // Update the quiz with the new question
    await db.update({
      TableName: 'QuizTable',
      Key: {
        quizId: quizId,
      },
      UpdateExpression:
        'SET questions = list_append(if_not_exists(questions, :empty_list), :newQuestion)',
      ExpressionAttributeValues: {
        ':newQuestion': [newQuestion],
        ':empty_list': [],
      },
    });

    return sendResponse({ success: true });
  } catch (error) {
    console.error('Error adding question:', error);
    return sendError(500, { message: 'Internal server error.' });
  }
};

const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(addQuestion);

module.exports = { handler };
