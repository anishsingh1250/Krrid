import type { NextApiRequest, NextApiResponse } from 'next';
import { Chess } from 'chess.js';
import { Stockfish } from 'stockfish-wasm';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fen, level = 10 } = req.body;
  const game = new Chess(fen);

  if (game.isGameOver()) {
    return res.status(400).json({ message: 'Game is already over' });
  }

  const stockfish = await Stockfish();
  stockfish.postMessage('uci');
  stockfish.postMessage(`position fen ${fen}`);
  stockfish.postMessage(`go depth ${level}`);

  let bestMove = '';
  stockfish.onmessage = (msg: string) => {
    if (msg.startsWith('bestmove')) {
      bestMove = msg.split(' ')[1];
      game.move(bestMove, { sloppy: true });
      res.status(200).json({ 
        move: bestMove,
        fen: game.fen()
      });
      stockfish.terminate();
    }
  };
}