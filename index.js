const express = require('express');
const path = require('path');

const app = express();
const http = require('http').Server(app);

// create new instance of socket.io
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  // res.send('<h1>Hello World</h1>');
  // send index.html instead
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 2400;

// listen the connection event for incoming sockets

// Event Fired when user connects
io.on('connection', function(socket) {
  console.log('a user connected');

  // set up data for the high scores collected over time.
  const leaderBoard = new Set();
  const rankings = [];
  socket.on('store highscore', function(responseCounter) {
    rankings.push(responseCounter);
    rankings.sort(function(a,b) {
      return a - b;
    })

    highScore = rankings[rankings.length - 1];

    console.log(rankings);

    io.emit('highscore message', highScore);
    socket.emit('rankings message', rankings);
  })

  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
});

http.listen(PORT, () => {
  console.log('listening on *:2400');
});
