const db = require('../db/connection');

const topic_id = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const allArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      const updatedRows = rows.map((row) => {
        const copyRow = { ...row };
        copyRow.comment_count = Number(row.comment_count);
        return copyRow;
      });
      return updatedRows;
    });
};

const user_info = () => {
  console.log('hello from models');
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

module.exports = { topic_id, allArticles, user_info };
