"use client";
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

type ChessboardUIProps = {
  fen?: string;
  turn?: string;
  makeMove?: (fen: string, move: any, turn: string) => void;
  moves?: any[];
  userId?: string;
  player_white?: string;
  player_black?: string;
  multiplayer?: boolean;
};

export default function ChessboardUI(props: ChessboardUIProps) {
  // Multiplayer mode: use props for state
  const isMultiplayer = !!props.multiplayer;
  const [fen, setFen] = useState("start");
  const [game, setGame] = useState(() => new Chess());
  const [aiLevel, setAiLevel] = useState(5); // 1-20
  const [playerColor, setPlayerColor] = useState<"white" | "black">("white");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [mode, setMode] = useState<'ai' | 'friend'>('ai');

  // Sync local state with multiplayer props
  useEffect(() => {
    if (isMultiplayer && props.fen) {
      setFen(props.fen);
      setGame(new Chess(props.fen));
    }
  }, [isMultiplayer, props.fen]);

  // Start new game (local only)
  function newGame() {
    setGame(new Chess());
    setFen("start");
    setIsAiThinking(false);
  }

  // AI move if it's AI's turn and mode is 'ai' (local only)
  useEffect(() => {
    if (isMultiplayer || mode !== 'ai') return;
    if (game.isGameOver() || game.turn() !== (playerColor === "white" ? "b" : "w")) return;
    setIsAiThinking(true);
    fetch("/api/ai-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen: game.fen(), aiLevel })
    })
      .then(res => res.json())
      .then(data => {
        if (data.move) {
          const newGame = new Chess(game.fen());
          newGame.move(data.move);
          setGame(newGame);
          setFen(newGame.fen());
        }
        setIsAiThinking(false);
      })
      .catch(() => setIsAiThinking(false));
  }, [fen, playerColor, aiLevel, mode, isMultiplayer]);

  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    if (isMultiplayer) {
      if (!props.userId || !props.player_white || !props.player_black) return false;
      // Only allow the correct player to move
      const isWhite = props.player_white === props.userId;
      const isBlack = props.player_black === props.userId;
      if ((props.turn === 'w' && !isWhite) || (props.turn === 'b' && !isBlack)) return false;
      const chess = new Chess(props.fen);
      const moves = chess.moves({ verbose: true });
      const isLegal = moves.some(m => m.from === sourceSquare && m.to === targetSquare);
      if (!isLegal) return false;
      const move = chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (move) {
        props.makeMove && props.makeMove(chess.fen(), move, chess.turn());
        return true;
      }
      return false;
    } else {
      if (game.isGameOver() || isAiThinking) return false;
      // In AI mode, only allow player to move their own color
      if (mode === 'ai' && ((playerColor === 'white' && game.turn() !== 'w') || (playerColor === 'black' && game.turn() !== 'b'))) return false;
      // In friend mode, allow both sides to move alternately
      const move = game.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (move) {
        setFen(game.fen());
        setGame(new Chess(game.fen()));
        return true;
      }
      return false;
    }
  }

  // Render
  return (
    <div className="w-full flex flex-col items-center">
      {!isMultiplayer && (
        <div className="mb-4 flex gap-4 items-center">
          <label className="font-heading font-semibold">Mode:</label>
          <select
            value={mode}
            onChange={e => setMode(e.target.value as any)}
            className="rounded px-2 py-1 border border-gray-300 font-heading"
          >
            <option value="ai">Play vs AI</option>
            <option value="friend">Play vs Friend</option>
          </select>
          {mode === 'ai' && (
            <>
              <label className="font-heading font-semibold ml-4">Play as:</label>
              <select
                value={playerColor}
                onChange={e => setPlayerColor(e.target.value as any)}
                className="rounded px-2 py-1 border border-gray-300 font-heading"
              >
                <option value="white">White</option>
                <option value="black">Black</option>
              </select>
              <label className="font-heading font-semibold ml-4">AI Level:</label>
              <select
                value={aiLevel}
                onChange={e => setAiLevel(Number(e.target.value))}
                className="rounded px-2 py-1 border border-gray-300 font-heading"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </>
          )}
          <button onClick={newGame} className="ml-4 bg-primary text-white rounded-lg px-4 py-2 font-heading text-base">New Game</button>
        </div>
      )}
      <div className="bg-gradient-to-br from-[#f0d9b5] to-[#b58863] p-3 rounded-2xl shadow-2xl border-4 border-[#b58863]">
        <Chessboard
          position={isMultiplayer && props.fen ? props.fen : fen}
          onPieceDrop={onPieceDrop}
          boardWidth={420}
          customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
          customDarkSquareStyle={{ backgroundColor: "#b58863" }}
          arePiecesDraggable={
            isMultiplayer
              ? !!props.userId && !!props.player_white && !!props.player_black &&
                ((props.turn === 'w' && props.player_white === props.userId) ||
                  (props.turn === 'b' && props.player_black === props.userId))
              : !game.isGameOver() && !isAiThinking
          }
          animationDuration={200}
          boardOrientation={
            isMultiplayer
              ? props.userId === props.player_black
                ? "black"
                : "white"
              : mode === 'ai' ? playerColor : 'white'
          }
        />
      </div>
      <div className="mt-4 text-gray-700 text-base bg-white/80 rounded-lg px-4 py-2 shadow font-mono">
        {isMultiplayer ? (
          <>
            {props.fen && new Chess(props.fen).isCheckmate() && <span className="text-red-600 font-bold">Checkmate! {props.turn === "w" ? "Black" : "White"} wins.</span>}
            {props.fen && new Chess(props.fen).isStalemate() && <span className="text-yellow-600 font-bold">Stalemate!</span>}
            {props.fen && new Chess(props.fen).isDraw() && <span className="text-blue-600 font-bold">Draw!</span>}
            {props.fen && !new Chess(props.fen).isGameOver() && (
              <span className="text-green-700">{props.turn === 'w' ? "White's" : "Black's"} move.</span>
            )}
          </>
        ) : (
          <>
            {game.isCheckmate() && <span className="text-red-600 font-bold">Checkmate! {game.turn() === "w" ? "Black" : "White"} wins.</span>}
            {game.isStalemate() && <span className="text-yellow-600 font-bold">Stalemate!</span>}
            {game.isDraw() && <span className="text-blue-600 font-bold">Draw!</span>}
            {!game.isGameOver() && (
              mode === 'ai'
                ? (isAiThinking ? <span className="text-primary">AI is thinking...</span> : <span className="text-green-700">Your move.</span>)
                : <span className="text-green-700">{game.turn() === 'w' ? "White's" : "Black's"} move.</span>
            )}
          </>
        )}
      </div>
    </div>
  );
} 