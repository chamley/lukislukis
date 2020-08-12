const socketIo = require('socket.io');

function makeIoServer(httpServer) {
  const io = socketIo(httpServer, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
  });
  io.origins(['http://lukis-lukis.herokuapp.com']);

  let users = []; // object with id: string, name: string;

  const removeUser = (socket) => users.filter((user) => user.id !== socket.id);

  io.on('connection', (socket) => {
    socket.emit('connection', socket.id);

    socket.on('login', () => {});
    io.set('origins', '*:*');

    socket.on('save', (msg) => {
      socket.broadcast.emit('saving', msg);
    });

    socket.on('enter', (name) => {
      users.push({
        id: socket.id,
        name,
      });
      socket.emit('userList', users);
      socket.broadcast.emit('userList', users);
    });

    socket.on('leave', () => {
      users = removeUser(socket);
      socket.broadcast.emit('userList', users);
    });

    socket.on('disconnect', () => {
      users = removeUser(socket);
      socket.broadcast.emit('userList', users);
    });
  });

  return io;
}

module.exports = makeIoServer;
