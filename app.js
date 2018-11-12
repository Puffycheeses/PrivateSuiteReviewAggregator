const express = require('express');
const app = express()
const server = require('http').Server(app);

server.listen(3000);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + 'index.html');
});

const io = require('socket.io')(server);
const back = require('./server/back')

io.on('connection', async function (socket) {
  await back.aggregator(socket)
});
