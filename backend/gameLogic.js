const { v4: uuidv4 } = require('uuid');

function randomTreasures() {
  const treasures = new Set();
  while (treasures.size < 3) {
    treasures.add(`${Math.floor(Math.random() * 5)},${Math.floor(Math.random() * 5)}`);
  }
  return [...treasures].map(t => t.split(',').map(Number));
}

function proximity(x, y, treasures) {
  return Math.min(...treasures.map(([tx, ty]) => Math.abs(tx - x) + Math.abs(ty - y)));
}

function startGame(name, games) {
  const userId = uuidv4();
  games[userId] = {
    name,
    treasures: randomTreasures(),
    revealed: {},
    score: 0,
    found: 0
  };
  return { userId };
}

function makeMove(userId, positions, games, scores) {
  const game = games[userId];
  if (!game) return { error: 'Game not found' };

  let results = [];
  game.score++;

  positions.forEach(([x, y]) => {
    const key = `${x},${y}`;
    if (game.revealed[key]) return;

    const isTreasure = game.treasures.some(([tx, ty]) => tx === x && ty === y);
    if (isTreasure) {
      game.revealed[key] = { treasure: true };
      game.found++;
      results.push({ x, y, treasure: true });
    } else {
      const prox = proximity(x, y, game.treasures);
      game.revealed[key] = { treasure: false, proximity: prox };
      results.push({ x, y, treasure: false, proximity: prox });
    }
  });

  if (game.found === 3) {
    scores.push({ name: game.name, score: game.score });
    scores.sort((a, b) => a.score - b.score);
    scores = scores.slice(0, 10);
    return { results, gameOver: true, score: game.score };
  }

  return { results, gameOver: false };
}

function resumeGame(userId, games) {
  return games[userId] || { error: 'Game not found' };
}

function getScores(scores) {
  return scores;
}

module.exports = { startGame, makeMove, resumeGame, getScores };
