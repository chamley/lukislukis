const socketIo = require('socket.io');
const controller = require('../controller/socketController');

function makeIoServer(httpServer) {
  const io = socketIo(httpServer);

  let users = []; // object with id: string, name: string;

  const removeUser = (socket) => users.filter((user) => user.id !== socket.id);

  io.on('connection', async (socket) => {
    socket.on('enter', (name) => {
      users.push({
        id: socket.id,
        name,
      });
      socket.emit('userList', users);
      socket.broadcast.emit('userList', users);
    });

    const canvas = await controller.getMainCanvas();
    socket.emit('connection', { id: socket.id, canvas });

    socket.on('login', () => {});

    socket.on('save', async (msg) => {
      socket.broadcast.emit('saving', msg);
      const res = await controller.putCanvas(msg.canvas);
      console.log(res);
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
