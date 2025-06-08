const express = require('express');
const app = express();
const db = require('./db/connection');

const { fetchApi } = require('./controllers/api.controllers');

app.use(express.json());

app.get('/api', fetchApi);

module.exports = app;
