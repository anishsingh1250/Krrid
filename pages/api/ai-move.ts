
import type { NextApiRequest, NextApiResponse } from 'next';
import { Chess } from 'chess.js';
import stockfish from 'stockfish.js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fen } = req.body;
  if (!fen) {
    return res.status(400).json({ message: 'FEN string is required' });
  }

  const chess = new Chess(fen);
  if (chess.isGameOver()) {
    return res.status(400).json({ message: 'Game is already over' });
  }

  const engine = stockfish();
  
  return new Promise((resolve) => {
    engine.onmessage = (event) => {
      const message = event;
      if (typeof message === 'string' && message.startsWith('bestmove')) {
        const move = message.split(' ')[1];
        chess.move({
          from: move.substring(0, 2),
          to: move.substring(2, 4),
          promotion: move.length === 5 ? move[4] : undefined
        });
        resolve(res.status(200).json({ 
          fen: chess.fen(),
          move: move,
          turn: chess.turn()
        }));
        engine.terminate();
      }
    };

    engine.postMessage('uci');
    engine.postMessage('isready');
    engine.postMessage(`position fen ${fen}`);
    engine.postMessage('go depth 15');
  });
}
