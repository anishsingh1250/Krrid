"use client";
import { useState, useRef } from "react";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

const pgn = "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7";

export default function ChessReplay() {
  const [moveIndex, setMoveIndex] = useState(0);
  const gameRef = useRef(new Chess());
  const moves = pgn.split(/\d+\.\s/).flatMap(s => s.trim().split(" ").filter(Boolean)).filter(m => !/\d+\./.test(m));

  // Play moves up to moveIndex
  function getFenAt(index: number) {
    const game = new Chess();
    for (let i = 0; i < index; i++) {
      game.move(moves[i]);
    }
    return game.fen();
  }

  const fen = getFenAt(moveIndex);

  function nextMove() {
    if (moveIndex < moves.length) setMoveIndex(moveIndex + 1);
  }
  function prevMove() {
    if (moveIndex > 0) setMoveIndex(moveIndex - 1);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <Chessboard
        width={400}
        position={fen}
        boardStyle={{ borderRadius: 12, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)" }}
        lightSquareStyle={{ backgroundColor: "#f0f0f0" }}
        darkSquareStyle={{ backgroundColor: "#25C6F5" }}
        draggable={false}
        transitionDuration={200}
      />
      <div className="mt-4 flex gap-4">
        <button onClick={prevMove} disabled={moveIndex === 0} className="bg-gray-200 text-black rounded-lg px-4 py-2 font-heading text-base disabled:opacity-50">Previous</button>
        <button onClick={nextMove} disabled={moveIndex === moves.length} className="bg-primary text-white rounded-lg px-4 py-2 font-heading text-base disabled:opacity-50">Next</button>
      </div>
      <div className="mt-2 text-gray-500 text-sm">Move {moveIndex} / {moves.length}</div>
    </div>
  );
} 