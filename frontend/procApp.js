const express = require('express');

const http = require('http');
const path = require('path');

var app = express;

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, './build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.set('port', PORT);
const server = http.createServer(app);

/* eslint-disable-next-line no-console */
server.listen(PORT, () => console.log('fe: ', PORT));

