const express = require('express');
const app = express();
const db = require('./db/connection');

const {
  fetchApi,
  fetchTopics,
  fetchArticles,
} = require('./controllers/api.controllers');

app.use(express.json());

app.get('/api', fetchApi);

app.get('/api/topics', fetchTopics);

app.get('/api/articles', fetchArticles);

module.exports = app;
