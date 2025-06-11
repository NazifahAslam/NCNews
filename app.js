const express = require('express');
const app = express();
const db = require('./db/connection');

const {
  fetchApi,
  fetchTopics,
  fetchArticles,
  fetchUsers,
} = require('./controllers/api.controllers');

app.use(express.json());

//app.use(express.static(public));

app.get('/api', fetchApi);

app.get('/api/topics', fetchTopics);

app.get('/api/articles', fetchArticles);

app.get('/api/users', fetchUsers);

module.exports = app;
