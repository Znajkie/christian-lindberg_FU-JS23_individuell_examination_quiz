const middy = require('@middy/core');
const { validateToken } = require('../../middleware/auth');
const { sendResponse } = require('../../responses/index');
const { middyTimeoutConfig } = require('../../services/middy');
const { getUser } = require('../../helpers/userHelper');


const handler = middy(middyTimeoutConfig)
  .use(validateToken)
  .handler(async (event) => {
    const user = await getUser(event.username);

    return sendResponse({
      firstname: user.username,
    });
  });

module.exports = { handler };
