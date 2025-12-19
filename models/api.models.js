const db = require("../db/connection");

const allTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

const allArticles = (sort_by = "created_at", order = "DESC", topic = null) => {
  const validColumns = ["created_at", "title", "votes", "author", "topic"];
  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let sortOrder;
  if (order.toLowerCase() === "asc") {
    sortOrder = "ASC";
  } else if (order.toLowerCase() === "desc") {
    sortOrder = "DESC";
  } else {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let topicFilter = "";
  const queryParams = [];
  if (topic) {
    topicFilter = "WHERE articles.topic = $1";
    queryParams.push(topic);
  }

  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.body, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id ${topicFilter} GROUP BY articles.article_id ORDER BY articles.${sort_by} ${sortOrder}`,
      queryParams
    )
    .then(({ rows }) => {
      if (topic && rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }

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
    .query(
      `SELECT articles.article_id, articles.title, articles.body, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      rows[0].comment_count = Number(rows[0].comment_count);
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
        return Promise.reject({ status: 404, message: "not found" });
      }
      return rows;
    });
};

const insertComments = (author, body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [author, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

const updateArticleVote = (articleId, inc_votes) => {
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *; `,
      [inc_votes, articleId]
    )

    .then(({ rows }) => {
      return rows[0];
    });
};

const removeComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
    comment_id,
  ]);
};

module.exports = {
  allTopics,
  allArticles,
  allUsers,
  articleId,
  articleIdComments,
  insertComments,
  updateArticleVote,
  removeComment,
};
