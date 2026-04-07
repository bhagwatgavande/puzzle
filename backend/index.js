const express = require('express');
const cors = require('cors');
const { startGame, makeMove, resumeGame, getScores } = require('./gameLogic');

const app = express();
app.use(cors());
app.use(express.json());

let games = {};
let scores = [];

app.post('/start', (req, res) => {
  const { name } = req.body;
  const { userId, board } = startGame(name, games);
  res.json({ userId });
});

app.post('/move', (req, res) => {
  const { userId, positions } = req.body;
  const result = makeMove(userId, positions, games, scores);
  res.json(result);
});

app.get('/resume/:userId', (req, res) => {
  const { userId } = req.params;
  const game = resumeGame(userId, games);
  res.json(game);
});

app.get('/scores', (req, res) => {
  res.json(getScores(scores));
});

app.listen(4000, () => console.log('Backend running on port 4000'));
