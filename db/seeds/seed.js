const format = require('pg-format');
const db = require('../connection');
const { convertTimestampToDate } = require('./utils');
const lookupObj = require('./utils2');

const seed = ({ topicData, userData, articleData, commentData }) => {
  return (
    db
      .query('DROP TABLE IF EXISTS comments')
      .then(() => {
        return db.query('DROP TABLE IF EXISTS articles');
      })
      .then(() => {
        return db.query('DROP TABLE IF EXISTS users');
      })
      .then(() => {
        return db.query('DROP TABLE IF EXISTS topics');
      })
      .then(() => {
        return db.query(
          'CREATE TABLE topics (slug VARCHAR PRIMARY KEY, description VARCHAR, img_url VARCHAR(1000) )'
        );
      })
      .then(() => {
        return db.query(
          'CREATE TABLE users (username VARCHAR PRIMARY KEY, name VARCHAR, avatar_url VARCHAR(1000) )'
        );
      })
      .then(() => {
        return db.query(
          'CREATE TABLE articles (article_id SERIAL PRIMARY KEY, title VARCHAR, topic VARCHAR REFERENCES topics(slug), author VARCHAR REFERENCES users(username), body TEXT, created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000))'
        );
      })
      .then(() => {
        return db.query(
          'CREATE TABLE comments (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
        );
      })

      //topic insert
      .then(() => {
        const formattedValues = topicData.map(
          ({ slug, description, img_url }) => {
            return [slug, description, img_url];
          }
        );
        const sqlString = format(
          'INSERT INTO topics(slug, description, img_url) VALUES %L RETURNING *',
          formattedValues
        );
        return db.query(sqlString);
      })
      //user insert
      .then(() => {
        const formattedValues = userData.map(
          ({ username, name, avatar_url }) => {
            return [username, name, avatar_url];
          }
        );
        const sqlString = format(
          'INSERT INTO users(username, name, avatar_url) VALUES %L RETURNING *',
          formattedValues
        );
        return db.query(sqlString);
      })
      //article insert
      .then(() => {
        const formattedValues = articleData.map((article) => {
          const updatedObj = convertTimestampToDate(article);

          return [
            updatedObj.title,
            updatedObj.topic,
            updatedObj.author,
            updatedObj.body,
            updatedObj.created_at,
            updatedObj.votes,
            updatedObj.article_img_url,
          ];
        });
        const sqlString = format(
          'INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *',
          formattedValues
        );
        return db.query(sqlString);
      })
      //comments insert
      .then(({ rows }) => {
        const articleLookup = lookupObj(rows, 'title', 'article_id');

        const formattedValues = commentData.map((comment) => {
          const updatedObj = convertTimestampToDate(comment);

          return [
            articleLookup[comment.article_title],
            updatedObj.body,
            updatedObj.votes,
            updatedObj.author,
            updatedObj.created_at,
          ];
        });

        const sqlString = format(
          'INSERT INTO comments(article_id, body, votes, author, created_at ) VALUES %L RETURNING *',
          formattedValues
        );
        return db.query(sqlString);
      })
  );
};

module.exports = seed;
