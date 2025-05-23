
import type { NextApiRequest, NextApiResponse } from 'next';
import { Chess } from 'chess.js';
import stockfish from 'stockfish';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fen, level = 10 } = req.body;
    const game = new Chess(fen);
    
    if (game.isGameOver()) {
      return res.status(400).json({ error: 'Game is already over' });
    }

    const engine = stockfish();
    
    return new Promise((resolve) => {
      engine.onmessage = (msg: string) => {
        if (msg.startsWith('bestmove')) {
          const move = msg.split(' ')[1];
          game.move(move, { sloppy: true });
          resolve(res.status(200).json({ 
            fen: game.fen(),
            move: move,
            isGameOver: game.isGameOver(),
            inCheck: game.inCheck()
          }));
          engine.terminate();
        }
      };

      engine.postMessage('uci');
      engine.postMessage('isready');
      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go depth ${level}`);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
