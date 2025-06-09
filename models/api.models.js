const db = require('../db/connection');

const topic_id = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    console.log('hello from models');

    return rows;
  });
};

module.exports = { topic_id };
