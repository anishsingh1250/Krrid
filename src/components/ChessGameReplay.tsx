"use client";
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { FaStepBackward, FaStepForward, FaPlay, FaPause, FaUndo, FaExternalLinkAlt } from "react-icons/fa";

// Types of chess games you can fetch from Lichess
type GameType = "bullet" | "blitz" | "rapid" | "classical" | "correspondence" | "chess960" | "crazyhouse" | "antichess";

export default function ChessGameReplay() {
  const [fen, setFen] = useState<string>("start");
  const [pgn, setPgn] = useState<string>("");
  interface GameInfo {
    white: string;
    black: string;
    date: string;
    result: string;
    event: string;
    eco: string;
    opening: string | null;
    whiteElo: string;
    blackElo: string;
    timeControl: string;
    termination: string;
    link: string | null;
  }
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // ms between moves
  const [loading, setLoading] = useState(true);
  const [gameType, setGameType] = useState<GameType>("rapid");
  const gameRef = useRef<Chess>(new Chess());
  const playbackTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchGame();
    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, [gameType]);

  useEffect(() => {
    if (isPlaying) {
      playbackTimer.current = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev < moves.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    } else if (playbackTimer.current) {
      clearInterval(playbackTimer.current);
    }

    return () => {
      if (playbackTimer.current) {
        clearInterval(playbackTimer.current);
      }
    };
  }, [isPlaying, moves.length, playbackSpeed]);

  useEffect(() => {
    if (currentMoveIndex >= 0 && moves.length > 0) {
      const chess = new Chess();

      // Apply all moves up to currentMoveIndex
      for (let i = 0; i <= currentMoveIndex; i++) {
        chess.move(moves[i]);
      }

      setFen(chess.fen());
    } else {
      setFen("start");
    }
  }, [currentMoveIndex, moves]);

  async function fetchGame() {
    setLoading(true);
    setGameInfo(null);
    setMoves([]);
    setPgn("");
    let errorMsg = "";
    try {
      // Try to fetch from Lichess API (will fail due to CORS)
      const response = await fetch(`https://lichess.org/api/games/rated?max=1&perfType=${gameType}&rated=true&clocks=false&evals=false&opening=false`);
      if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
        throw new Error("Lichess API is not available from the browser due to CORS. Showing a demo game instead.");
      }
      const data = await response.text();
      const chess = new Chess();
      chess.loadPgn(data);
      const headers = chess.header();
      setGameInfo({
        white: headers.White,
        black: headers.Black,
        date: headers.Date,
        result: headers.Result,
        event: headers.Event,
        eco: headers.ECO,
        opening: headers.Opening || null,
        whiteElo: headers.WhiteElo,
        blackElo: headers.BlackElo,
        timeControl: headers.TimeControl,
        termination: headers.Termination,
        link: headers.Site,
      });
      setMoves(chess.history());
      setPgn(data);
      setCurrentMoveIndex(-1);
      gameRef.current.reset();
      setFen("start");
    } catch (error) {
      // Use a static PGN as fallback
      errorMsg = (error as Error).message;
      const fallbackPGN = `1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7`;
      const chess = new Chess();
      chess.loadPgn(fallbackPGN);
      setGameInfo({
        white: "Demo White",
        black: "Demo Black",
        date: "2024.01.01",
        result: "*",
        event: "Demo Game",
        eco: "C65",
        opening: "Ruy Lopez",
        whiteElo: "-",
        blackElo: "-",
        timeControl: "-",
        termination: "-",
        link: null,
      });
      setMoves(chess.history());
      setPgn(fallbackPGN);
      setCurrentMoveIndex(-1);
      gameRef.current.reset();
      setFen("start");
    } finally {
      setLoading(false);
    }
  }

  function handleNextMove() {
    if (currentMoveIndex < moves.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
    }
  }

  function handlePrevMove() {
    if (currentMoveIndex >= 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
    }
  }

  function handleReset() {
    setCurrentMoveIndex(-1);
    setIsPlaying(false);
  }

  function togglePlayback() {
    setIsPlaying(!isPlaying);
  }

  function handlePieceDrop(sourceSquare: string, targetSquare: string) {
    // For replay, don't allow manual moves
    return false;
  }

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="flex flex-col items-center">
        <div className="bg-[#e0e0e0] p-2 rounded-xl shadow-lg" style={{ border: "4px solid #b58863" }}>
          {!loading && (
            <Chessboard
              position={fen}
              onPieceDrop={handlePieceDrop}
              boardWidth={400}
              customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
              customDarkSquareStyle={{ backgroundColor: "#b58863" }}
              arePiecesDraggable={false}
              animationDuration={200}
            />
          )}
          {loading && <div className="w-[400px] h-[400px] flex items-center justify-center text-lg text-primary animate-pulse">Loading...</div>}
        </div>
        <div className="mt-4 flex items-center gap-3 justify-center">
          <button onClick={handleReset} className="text-primary rounded-full p-2 hover:bg-gray-100">
            <FaUndo />
          </button>
          <button onClick={handlePrevMove} className="text-primary rounded-full p-2 hover:bg-gray-100">
            <FaStepBackward />
          </button>
          <button onClick={togglePlayback} className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary-dark">
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button onClick={handleNextMove} className="text-primary rounded-full p-2 hover:bg-gray-100">
            <FaStepForward />
          </button>
          <select 
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="ml-2 border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="2000">Slow</option>
            <option value="1000">Medium</option>
            <option value="500">Fast</option>
          </select>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <select
            value={gameType}
            onChange={(e) => setGameType(e.target.value as GameType)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="bullet">Bullet</option>
            <option value="blitz">Blitz</option>
            <option value="rapid">Rapid</option>
            <option value="classical">Classical</option>
            <option value="correspondence">Correspondence</option>
            <option value="chess960">Chess960</option>
            <option value="crazyhouse">Crazyhouse</option>
            <option value="antichess">Antichess</option>
          </select>
          <button onClick={fetchGame} className="bg-primary text-white rounded-lg px-4 py-2 font-heading text-base">Load New Game</button>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <h3 className="font-heading text-lg mb-2">Game Info</h3>
        {gameInfo && (
          <>
            {pgn === "1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7" && (
              <div className="text-red-600 text-sm mb-2">Lichess API is not available from the browser. Showing a demo game instead.</div>
            )}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">{gameInfo.white}</div>
                  <div className="text-sm text-gray-500">Rating: {gameInfo.whiteElo || "N/A"}</div>
                </div>
                <div className="text-xl font-bold">vs</div>
                <div className="text-right">
                  <div className="font-semibold">{gameInfo.black}</div>
                  <div className="text-sm text-gray-500">Rating: {gameInfo.blackElo || "N/A"}</div>
                </div>
              </div>
              <div className="flex justify-center text-xl text-primary font-bold">{gameInfo.result}</div>
            </div>

            <div className="mt-2">
              <div className="flex gap-2 items-center"><span className="font-semibold">Date:</span> {gameInfo.date}</div>
              <div className="flex gap-2 items-center"><span className="font-semibold">Event:</span> {gameInfo.event}</div>
              <div className="flex gap-2 items-center"><span className="font-semibold">Time Control:</span> {gameInfo.timeControl}</div>
              {gameInfo.opening && <div className="flex gap-2 items-center"><span className="font-semibold">Opening:</span> {gameInfo.opening}</div>}
              {!gameInfo.opening && gameInfo.eco && <div className="flex gap-2 items-center"><span className="font-semibold">ECO:</span> {gameInfo.eco}</div>}
              <div className="flex gap-2 items-center mt-4">
                <span className="font-semibold">Move:</span> {currentMoveIndex + 1} / {moves.length}
              </div>
            </div>

            <div className="font-semibold mt-4 mb-2">Move History:</div>
            <div className="border border-gray-200 rounded p-2 bg-gray-50 h-48 overflow-y-auto text-sm">
              <div className="flex flex-wrap gap-x-2">
                {moves.map((move, index) => (
                  <span 
                    key={index} 
                    className={`${index === currentMoveIndex ? 'bg-primary text-white' : ''} 
                              cursor-pointer px-1 py-0.5 rounded`}
                    onClick={() => setCurrentMoveIndex(index)}
                  >
                    {index % 2 === 0 && <span className="text-gray-500 mr-1">{Math.floor(index/2) + 1}.</span>}
                    {move}
                  </span>
                ))}
              </div>
            </div>
            {gameInfo.link && (
              <a href={gameInfo.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline text-sm mt-2">
                <FaExternalLinkAlt size={12} /> View on Lichess
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}