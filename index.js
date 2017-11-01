const express = require('express');
const path = require('path');

const app = express();
const http = require('http').createServer(app);

// create new instance of socket.io
var io = require('socket.io')(http);

const publicPath = path.join(__dirname, 'public');

app.get('/', (req, res) => {
  // res.send('<h1>Hello World</h1>');
  // send index.html instead
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(express.static(publicPath));

const PORT = process.env.PORT || 2400;

// set up data for the high scores collected over time.
const leaderBoard = new Set();

// listen the connection event for incoming sockets

// Event Fired when user connects
io.on('connection', function(socket) {
  console.log('a user connected');

  const rankings = [];
  socket.on('store highscore', function(responseCounter) {
    rankings.push(responseCounter);
    console.log(rankings);
    socket.emit('rankings message', rankings);
    rankings.sort(function(a,b) {
      return a - b;
    });

    highScore = rankings[rankings.length - 1];


    io.emit('highscore message', highScore);
  })

  socket.on('disconnect', function() {
    console.log('user disconnected');
  })
});

http.listen(PORT, () => {
  console.log('listening on *:2400');
});

/*
socket.on('get scores', function() {
  const scores = [];

  for (score of leaderBoard.values()) {
    scores.push(score);
  }

  socket.emit('scores', scores);
});
*/
