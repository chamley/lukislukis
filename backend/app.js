const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const router = require('./routes/router');
const app = express();




app.use(cors({
  origin:'https://fe-lukislukis.herokuapp.com',
  credentials:'include'
}));
app.use(helmet());
app.use(express.json({ limit: '500MB', type: 'application/json' }));
app.use(express.urlencoded({ limit: '500MB', extended: true }));
app.use(router);

app.all('*', (req, res) => {
  res.status(404);
  res.send('<h3>Error 404: page not found</h3>');
});

module.exports = app;
