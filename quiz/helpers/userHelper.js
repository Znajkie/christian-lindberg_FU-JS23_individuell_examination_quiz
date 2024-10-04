const { db } = require('../services/db');

async function getUser(username) {

  const { Item } = await db.get({
    TableName: 'UserTable',
    Key: {
      username: username,
    },
  });

  return Item;
}

module.exports = { getUser };

