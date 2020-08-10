const app = require('express')();
const http = require('http').createServer(app);
const makeIoServer = require('./ioSocket');

const io = makeIoServer(http);
io.on('connect_failed', () => console.error('Connection failed!'));

http.listen(4000, () => console.info('listening on *:4000'));
