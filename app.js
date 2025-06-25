const express = require('express');
const app = express();
const db = require('./db/connection');

const {
  fetchApi,
  fetchTopics,
  fetchArticles,
  fetchUsers,
  fetchArticleId,
} = require('./controllers/api.controllers');

app.use(express.json());

app.use(express.static('public'));

app.get('/api', fetchApi);

app.get('/api/topics', fetchTopics);

app.get('/api/articles', fetchArticles);

app.get('/api/users', fetchUsers);

app.get('/api/articles/:article_id', fetchArticleId);

app.use((error, request, response, next) => {
  response.status(error.status).send({ message: 'not found' });
});

app.use((error, request, response, next) => {
  if (error.code === '22P02') {
    response.status(error.status).send({ message: 'bad request' });
  }
  // console.log(error, 'hi from 400 app');
  // next;
});

module.exports = app;
