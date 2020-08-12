
const app = require('express')();
const httpmodule = require('http');

const makeIoServer = require('./ioSocket');
const cors = require('cors');

const IO_PORT = process.env.PORT


app.use(cors());
// const corsOptions = {
//   origin: 'https://lukis-lukis.herokuapp.com'
// }
//app.get('*', cors(corsOptions))

// app.use(cors({
//   origin: 'https://lukis-lukis.herokuapp.com'
// }));

// app.use( (req,res,next)=> {
//   res.header("Access-Control-Allow-Origin", "*:*");
// })

const http = httpmodule.createServer(app);
const io = makeIoServer(http)
  .listen(IO_PORT, () => console.info('listening on *:4000'));

io.on('connect_failed', () => console.error('Connection failed!'));





