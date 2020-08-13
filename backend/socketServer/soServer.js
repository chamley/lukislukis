const app = require('express')();
const http = require('http').createServer(app);
const makeIoServer = require('./ioSocket');
const mongoose = require('mongoose');
require('dotenv').config();

const io = makeIoServer(http);
io.on('connect_failed', () => console.error('Connection failed!'));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.info('Successfully connected to the Mongo database!');
    mongoose.connection.on('error', console.error);
    http.listen(4000, () => console.info(`Server is running at port: 4000`));
  })
  .catch(console.error);
