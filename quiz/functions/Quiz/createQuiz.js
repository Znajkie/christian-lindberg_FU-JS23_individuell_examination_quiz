const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../services/db');

exports.handler = async (event) => {
  try {
    const { userId, quizId, question, answer, longitude, latitude } = JSON.parse(event.body);

 await db.put({
   TableName: 'QuizTable',
   Item: {
     userId: userId,
     quizId: quizId,
     questions: [
       {
         question: question,
         answer: answer,
         location: {
           longitude: longitude,
           latitude: latitude,
         },
       },
     ],
   },
 });

    return sendResponse({ success: true });
  } catch (error) {
    console.error('Error creating user:', error);
    return sendError(500, { message: 'Internal server error.' });
  }
};