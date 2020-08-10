const socketIo = require('socket.io');

function makeIoServer(httpServer) {
  const io = socketIo(httpServer);

  let users = []; // object with id: string, name: string;
  let lockby = {}; // object with id:, timestamp

  const removeUser = (socket) => users.filter((user) => user.id !== socket.id);

  io.on('connection', (socket) => {
    socket.emit('connection', socket.id);

    socket.on('login', () => {});

    socket.on('save', (msg) => {
      lockby = {};
      socket.broadcast.emit('saving', msg);
      socket.broadcast.emit('locks', lockby);
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
      if (socket.id === lockby.id) {
        lockby = {};
        socket.broadcast.emit('locks', lockby);
      }
      users = removeUser(socket);
      socket.broadcast.emit('userList', users);
    });

    socket.on('disconnect', () => {
      if (socket.id === lockby.id) {
        lockby = {};
        socket.broadcast.emit('locks', lockby);
      }
      users = removeUser(socket);
      socket.broadcast.emit('userList', users);
    });

    socket.on('lock', (name) => {
      lockby = {
        id: socket.id,
        name,
        time: Date.now(),
      };
      socket.broadcast.emit('locks', lockby);
    });

    socket.on('unlock', () => {
      lockby = {};
      socket.broadcast.emit('locks', lockby);
    });

    socket.on('getLocks', () => {
      socket.emit('locks', lockby);
    });
  });

  return io;
}

module.exports = makeIoServer;
