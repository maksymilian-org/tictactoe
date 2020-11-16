import http from 'http';
import express from 'express';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static('dist'));

app.use('/:id', express.static('dist'));

const winners = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const state = {};

const checkWinner = (hash) => {
  const initialArr = [];
  const playerValues = state[hash].values.reduce((arr, v, i) => {
    if (v === state[hash].turn) arr.push(i);
    return arr;
  }, initialArr);
  winners.forEach((winner) => {
    if (winner.every((v) => playerValues.includes(v))) {
      state[hash].winner = state[hash].turn;
      state[hash].winnerSquares = winner;
      state[hash].result[state[hash].turn === 'o' ? 0 : 1]++;
    }
  });
};

const connect = (playerId, hash) => {
  if (!state[hash])
    state[hash] = {
      values: ['', '', '', '', '', '', '', '', ''],
      turn: 'o',
      winner: '',
      winnerSquares: [-1],
      result: [0, 0],
      players: [undefined, undefined]
    };
  state[hash].players[0]
    ? state[hash].players[1]
      ? undefined
      : (state[hash].players[1] = playerId)
    : (state[hash].players[0] = playerId);
  io.emit('update', state[hash]);
};

const disconnect = (playerId, hash) => {
  state[hash].players = state[hash].players.map((id) => (id === playerId ? undefined : id));
  io.emit('update', state[hash]);
};

const move = (id, hash) => {
  state[hash].values[id] = state[hash].turn;
  checkWinner(hash);
  state[hash].turn = state[hash].turn === 'o' ? 'x' : 'o';
  io.emit('update', state[hash]);
};

const clear = (hash) => {
  state[hash].values = ['', '', '', '', '', '', '', '', ''];
  state[hash].winner = '';
  state[hash].winnerSquares = [-1];
  io.emit('update', state[hash]);
};

io.on('connection', (client) => {
  const { host, referer } = client.handshake.headers;
  const hash = referer
    .replace(host, '')
    .replace(/https?:/, '')
    .replace(/\//g, '');
  connect(client.id, hash);

  client.on('move', ({ id, hash }) => {
    move(id, hash);
  });

  client.on('clear', (hash) => {
    clear(hash);
  });

  client.on('disconnect', () => {
    disconnect(client.id, hash);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
