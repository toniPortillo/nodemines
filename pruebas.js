const { createServer } = require('net');
let entries = require('object.entries');

const server = createServer();
let counter = 0;
let sockets = {}

server.on('connection', socket => {
  socket.id = counter++;
  
  console.log('client has connected')
  socket.write('Please enter your name: ')

  socket.on('data', data => {
    if(!sockets[socket.id]) {
      socket.name = data.toString().trim();
      socket.write(`Welcome ${socket.name}!\n`);
      sockets[socket.id] = socket;
      return;
    }
    entries(sockets).forEach(([key, cs]) => {
    console.log(`${socket.id}: ${data}`)
      if (key != socket.id) {
        cs.write(`${socket.name}: `);
        cs.write(data);
      }
    })
  });
  socket.setEncoding('utf8');
  socket.on('end', data => {
    delete sockets[socket.id];
    entries(sockets).forEach(([keys, sc]) => {
      sc.write(`${socket.name}: `);
      sc.write('has disconnected\n');
    })
    console.log(`${socket.name} has disconnected`)
  })
})

server.listen(2050, () => console.log('Server started'));