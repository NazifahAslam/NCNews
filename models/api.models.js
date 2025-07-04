const db = require('../db/connection');

const allTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const allArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.body, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC`
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

const allUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

const articleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: 'not found' });
      }
      return rows[0];
    });
};

const articleIdComments = (article_id) => {
  return db
    .query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: 'not found' });
      }
      return rows;
    });
};

module.exports = {
  allTopics,
  allArticles,
  allUsers,
  articleId,
  articleIdComments,
};
