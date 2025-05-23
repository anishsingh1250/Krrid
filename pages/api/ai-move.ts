import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { fen, aiLevel } = req.body;
  const stockfishPath = path.join(process.cwd(), 'bin', 'stockfish.exe.exe');
  const stockfish = spawn(stockfishPath);
  let bestMove: { from: string; to: string; promotion?: string } | null = null;

  stockfish.stdin.write('ucinewgame\n');
  stockfish.stdin.write(`position fen ${fen}\n`);
  stockfish.stdin.write(`go depth ${parseInt(aiLevel, 10) + 5}\n`);

  stockfish.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1];
        if (move && move !== '(none)') {
          bestMove = {
            from: move.slice(0, 2),
            to: move.slice(2, 4),
            promotion: move.length > 4 ? move.slice(4) : undefined,
          };
        }
        stockfish.kill();
        res.status(200).json({ move: bestMove });
      }
    }
  });

  stockfish.stderr.on('data', (data) => {
    console.error(`Stockfish error: ${data}`);
  });

  stockfish.on('error', (err) => {
    res.status(500).json({ error: 'Failed to run Stockfish', details: err.message });
  });
} 