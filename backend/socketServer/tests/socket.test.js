const ioClient = require('socket.io-client');
const http = require('http');
const makeIoServer = require('../ioSocket');

describe('basic socket.io example', () => {
  const serve = {
    socket: null,
    httpServer: null,
    httpServerAddr: null,
    ioServer: null,
  };

  beforeAll(() => {
    const s = serve;
    s.httpServer = http.createServer();
    s.ioServer = makeIoServer(s.httpServer);
    s.httpServer.listen();
    s.httpServerAddr = s.httpServer.address();
  });

  afterAll(async (done) => {
    const s = serve;
    s.ioServer.close(() => s.httpServer.close(done));
  });

  beforeEach(() => {
    // Square brackets are used for IPv6
    const s = serve;
    s.socket = ioClient.connect(`http://[${s.httpServerAddr.address}]:${s.httpServerAddr.port}`, {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });
    s.socket.on('connect', () => {});
  });

  afterEach(() => {
    const s = serve;
    if (s.socket.connected) s.socket.disconnect();
  });

  test('should communicate', async (done) => {
    const s = serve;
    s.ioServer.emit('echo', 'Hello World');
    s.socket.once('echo', async (message) => {
      await expect(message).toBe('Hello World');
    });
    s.ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
    done();
  });

  test('should communicate with waiting for socket.io handshakes', async (done) => {
    const s = serve;
    s.socket.emit('examlpe', 'some messages');
    setTimeout(() => {
      // Put your server side expect() here
      done();
    }, 50);
  });
});
