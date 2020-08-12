
const app = require('express')();
const httpmodule = require('http');
const cors = require('cors');
const makeIoServer = require('./ioSocket');

const IO_PORT = process.env.IO_PORT || 4000;

// app.use something something

// app.use(cors({
//   credentials:false,
//   origin: 'https://lukis-lukis.herokuapp.com/'
// }));
app.use(function (req, res, next) { 
  res.header("Access-Control-Allow-Origin", "http://lukis-lukis.herokuapp.com");
  res.header('Access-Control-Allow-Credentials', true); 
  next();
});

const http = httpmodule.createServer(app);
const io = makeIoServer(http)
  .listen(IO_PORT, () => console.info('listening on *:4000'));

//give io a handle request

io.on('connect_failed', () => console.error('Connection failed!'));

//http.;



