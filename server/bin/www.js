#!/usr/bin/env node

const { resolve } = require('path');
// const history = require('connect-history-api-fallback');
const express = require('express');
const configureAPI = require('../app');

const app = express();

const PORT = process.env.GREENHOUSE_PORT;

// API
configureAPI(app);

// UI
const publicPath = resolve(__dirname, '../../dist');
const staticConf = { maxAge: '1y', etag: false };

app.use(express.static(publicPath, staticConf));
// app.use('/', history());
const path = require('path');
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

// Go
app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
