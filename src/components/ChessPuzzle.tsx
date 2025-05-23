"use client";
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { FaCheckCircle, FaTimesCircle, FaLightbulb } from "react-icons/fa";

const difficultyMap = {
  easy: [0, 1400],
  medium: [1401, 1800],
  hard: [1801, 3000],
};

export default function ChessPuzzle() {
  const [fen, setFen] = useState<string | null>(null);
  const [solution, setSolution] = useState<string[]>([]);
  const [moveIndex, setMoveIndex] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [loading, setLoading] = useState(true);
  const [puzzleInfo, setPuzzleInfo] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [showSolution, setShowSolution] = useState(false);
  const gameRef = useRef<Chess | null>(null);

  useEffect(() => {
    fetchPuzzle();
    // eslint-disable-next-line
  }, [difficulty]);

  async function fetchPuzzle() {
    setLoading(true);
    setStatus(null);
    setStatusType(null);
    setMoveIndex(0);
    setShowSolution(false);

    // Fallback demo puzzle
    const fallback = {
      game: { fen: "r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 3" },
      puzzle: { solution: ["Nxe5", "Nxe5", "Bxf7+"], rating: 1500, themes: ["opening", "tactic"], id: "demo" }
    };

    let data = fallback;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000); // 3s timeout

      const res = await fetch("https://lichess.org/api/puzzle/daily", { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        const rating = json.puzzle.rating;
        const [min, max] = difficultyMap[difficulty];
        if (
          rating >= min &&
          rating <= max &&
          json.game &&
          json.game.fen &&
          Array.isArray(json.puzzle.solution) &&
          json.puzzle.solution.length > 0
        ) {
          data = json;
        }
      }
    } catch (e) {
      console.log("Using fallback puzzle due to error:", e);
    }

    setFen(data.game.fen);
    setSolution(data.puzzle.solution);
    setPuzzleInfo({ rating: data.puzzle.rating, themes: data.puzzle.themes, id: data.puzzle.id });
    gameRef.current = new Chess(data.game.fen);
    setLoading(false);
  }

  function onPieceDrop(sourceSquare: string, targetSquare: string) {
    if (!gameRef.current) return false;
    const moves = gameRef.current.moves({ verbose: true });
    const isLegal = moves.some(
      (m) => m.from === sourceSquare && m.to === targetSquare
    );
    if (!isLegal) return false;

    const move = gameRef.current.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
    if (move) {
      setFen(gameRef.current.fen());
      // Check if move matches solution
      const expected = solution[moveIndex];
      const moveSan = move.san;
      if (moveSan === expected) {
        if (moveIndex === solution.length - 1) {
          setStatus("Correct! Puzzle solved.");
          setStatusType("success");
        } else {
          setMoveIndex(moveIndex + 1);
          setStatus("Correct! Next move...");
          setStatusType("success");
        }
      } else {
        setStatus("Incorrect move. Try again.");
        setStatusType("error");
        // Undo the move
        gameRef.current.undo();
        setFen(gameRef.current.fen());
      }
      return true;
    }
    return false;
  }

  function handleShowSolution() {
    setShowSolution(true);
    setStatus("Solution: " + solution.join(", "));
    setStatusType(null);
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="flex flex-col items-center">
        <div className="bg-[#e0e0e0] p-2 rounded-xl shadow-lg" style={{ border: "4px solid #b58863" }}>
          {fen && !loading && (
            <Chessboard
              position={fen}
              onPieceDrop={onPieceDrop}
              boardWidth={400}
              customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
              customDarkSquareStyle={{ backgroundColor: "#b58863" }}
              arePiecesDraggable={true}
              animationDuration={200}
            />
          )}
          {loading && <div className="w-[400px] h-[400px] flex items-center justify-center text-lg text-primary animate-pulse">Loading...</div>}
        </div>
        <button onClick={fetchPuzzle} className="mt-4 bg-primary text-white rounded-lg px-4 py-2 font-heading text-base">Next Puzzle</button>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <div className="flex items-center gap-2">
          <label htmlFor="difficulty" className="font-heading font-semibold">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as any)}
            className="rounded px-2 py-1 border border-gray-300 font-heading"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <h3 className="font-heading text-lg mb-2">Puzzle Info</h3>
        {puzzleInfo && (
          <>
            <div className="flex gap-2 items-center"><span className="font-semibold">ID:</span> {puzzleInfo.id}</div>
            <div className="flex gap-2 items-center"><span className="font-semibold">Rating:</span> {puzzleInfo.rating}</div>
            <div className="flex gap-2 items-center flex-wrap"><span className="font-semibold">Themes:</span> {puzzleInfo.themes.join(", ")}</div>
          </>
        )}
        <div className="mt-4 min-h-[32px] flex items-center gap-2">
          {statusType === "success" && <FaCheckCircle className="text-green-600 text-xl" />}
          {statusType === "error" && <FaTimesCircle className="text-red-500 text-xl" />}
          <span className={statusType === "success" ? "text-green-700" : statusType === "error" ? "text-red-600" : "text-gray-700"}>{status}</span>
        </div>
        {!showSolution && (
          <button onClick={handleShowSolution} className="flex items-center gap-2 mt-2 bg-yellow-400 text-black rounded-lg px-3 py-1 font-heading text-sm hover:bg-yellow-300"><FaLightbulb /> Show Solution</button>
        )}
      </div>
    </div>
  );
} 