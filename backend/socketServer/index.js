const app = require('express')();
const http = require('http').createServer(app);





let users = []; // object with id: string, name: string;
let lockby = {}; // object with id:, timestamp

const removeUser = (socket) => users.filter((user) => user.id !== socket.id);

const PORT_VAR = process.env.PORT || 4000;



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

http.listen(PORT, () => console.info(`listening on *:${PORT_VAR}`));
