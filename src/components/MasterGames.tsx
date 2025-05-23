"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FaSearch, FaStar, FaChess, FaUndo, FaStepBackward, FaStepForward, FaPause, FaPlay } from "react-icons/fa";

// Dynamically import Chessboard to avoid SSR issues
const Chessboard = dynamic(() => import("chessboardjsx"), { 
  ssr: false 
});

// We'll dynamically import the ChessGameReplay component to avoid SSR issues
const ChessGameReplay = dynamic(() => import("./ChessGameReplay"), { 
  ssr: false,
  loading: () => <div className="w-[800px] h-[500px] flex items-center justify-center">Loading chess board...</div>
});

// Famous historical games collection
const famousGames = [
  {
    id: "opera-house",
    name: "The Opera House Game",
    white: "Paul Morphy",
    black: "Duke Karl / Count Isouard",
    year: 1858,
    pgn: "1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8#",
    description: "This famous game was played by Paul Morphy during an opera performance. It showcases Morphy's attacking genius and piece development principles.",
    featured: true
  },
  {
    id: "evergreen-game",
    name: "The Evergreen Game",
    white: "Adolf Anderssen",
    black: "Jean Dufresne",
    year: 1852,
    pgn: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O d3 8. Qb3 Qf6 9. e5 Qg6 10. Re1 Nge7 11. Ba3 b5 12. Qxb5 Rb8 13. Qa4 Bb6 14. Nbd2 Bb7 15. Ne4 Qf5 16. Bxd3 Qh5 17. Nf6+ gxf6 18. exf6 Rg8 19. Rad1 Qxf3 20. Rxe7+ Nxe7 21. Qxd7+ Kxd7 22. Bf5+ Ke8 23. Bd7+ Kf8 24. Bxe7#",
    description: "Called the 'Evergreen Game' for its enduring beauty, this game features one of the most brilliant combinations in chess history.",
    featured: true
  },
  {
    id: "immortal-game",
    name: "The Immortal Game",
    white: "Adolf Anderssen",
    black: "Lionel Kieseritzky",
    year: 1851,
    pgn: "1. e4 e5 2. f4 exf4 3. Bc4 Qh4+ 4. Kf1 b5 5. Bxb5 Nf6 6. Nf3 Qh6 7. d3 Nh5 8. Nh4 Qg5 9. Nf5 c6 10. g4 Nf6 11. Rg1 cxb5 12. h4 Qg6 13. h5 Qg5 14. Qf3 Ng8 15. Bxf4 Qf6 16. Nc3 Bc5 17. Nd5 Qxb2 18. Bd6 Bxg1 19. e5 Qxa1+ 20. Ke2 Na6 21. Nxg7+ Kd8 22. Qf6+ Nxf6 23. Be7#",
    description: "Perhaps the most famous chess game ever played, Anderssen sacrificed a queen, two rooks, and a bishop to deliver a stunning checkmate.",
    featured: true
  },
  {
    id: "game-of-the-century",
    name: "Game of the Century",
    white: "Donald Byrne",
    black: "Bobby Fischer",
    year: 1956,
    pgn: "1. Nf3 Nf6 2. c4 g6 3. Nc3 Bg7 4. d4 O-O 5. Bf4 d5 6. Qb3 dxc4 7. Qxc4 c6 8. e4 Nbd7 9. Rd1 Nb6 10. Qc5 Bg4 11. Bg5 Na4 12. Qa3 Nxc3 13. bxc3 Nxe4 14. Bxe7 Qb6 15. Bc4 Nxc3 16. Bc5 Rfe8+ 17. Kf1 Be6 18. Bxb6 Bxc4+ 19. Kg1 Ne2+ 20. Kf1 Nxd4+ 21. Kg1 Ne2+ 22. Kf1 Nc3+ 23. Kg1 axb6 24. Qb4 Ra4 25. Qxb6 Nxd1 26. h3 Rxa2 27. Kh2 Nxf2 28. Re1 Rxe1 29. Qd8+ Bf8 30. Nxe1 Bd5 31. Nf3 Ne4 32. Qb8 b5 33. h4 h5 34. Ne5 Kg7 35. Kg1 Bc5+ 36. Kf1 Ng3+ 37. Ke1 Bb4+ 38. Kd1 Bb3+ 39. Kc1 Ne2+ 40. Kb1 Nc3+ 41. Kc1 Rc2#",
    description: "The 13-year-old Bobby Fischer showcased his genius in this brilliant game featuring the famous queen sacrifice.",
    featured: true
  },
  {
    id: "kasparov-topalov",
    name: "Kasparov's Immortal",
    white: "Garry Kasparov",
    black: "Veselin Topalov",
    year: 1999,
    pgn: "1. e4 d6 2. d4 Nf6 3. Nc3 g6 4. Be3 Bg7 5. Qd2 c6 6. f3 b5 7. Nge2 Nbd7 8. Bh6 Bxh6 9. Qxh6 Bb7 10. a3 e5 11. O-O-O Qe7 12. Kb1 a6 13. Nc1 O-O-O 14. Nb3 exd4 15. Rxd4 c5 16. Rd1 Nb6 17. g3 Kb8 18. Na5 Ba8 19. Bh3 d5 20. Qf4+ Ka7 21. Rhe1 d4 22. Nd5 Nbxd5 23. exd5 Qd6 24. Rxd4 cxd4 25. Re7+ Kb6 26. Qxd4+ Kxa5 27. b4+ Ka4 28. Qc3 Qxd5 29. Ra7 Bb7 30. Rxb7 Qc4 31. Qxf6 Kxa3 32. Qxa6+ Kxb4 33. c3+ Kxc3 34. Qa1+ Kd2 35. Qb2+ Kd1 36. Bf1 Rd2 37. Rd7 Rxd7 38. Bxc4 bxc4 39. Qxh8 Rd3 40. Qa8 c3 41. Qa4+ Ke1 42. f4 f5 43. Kc1 Rd2 44. Qa7",
    description: "Kasparov's stunning sacrifices and deep calculations in this game are considered among the greatest chess displays ever.",
    featured: true
  }
];

export default function MasterGames() {
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState(famousGames);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGames(famousGames);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredGames(famousGames.filter(game => 
        game.name.toLowerCase().includes(term) ||
        game.white.toLowerCase().includes(term) ||
        game.black.toLowerCase().includes(term) ||
        game.year.toString().includes(term)
      ));
    }
  }, [searchTerm]);

  const loadGame = (game: any) => {
    setSelectedGame(game);
  };

  return (
    <div className="w-full">
      {!selectedGame ? (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <div className="mb-6 flex flex-col items-center">
              <h2 className="font-heading text-2xl text-primary mb-2">Famous Chess Games</h2>
              <p className="text-gray-600 text-center max-w-lg">
                Study these masterpieces to improve your chess understanding and appreciate the beauty of the game.
              </p>
            </div>
            
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search by player name, game title, or year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGames.map((game) => (
                <div 
                  key={game.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                  onClick={() => loadGame(game)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-lg font-medium">{game.name}</h3>
                    {game.featured && <FaStar className="text-yellow-400" />}
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-3">
                    <div>{game.white} vs {game.black}</div>
                    <div>{game.year}</div>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">{game.description}</p>
                  <button
                    className="mt-3 text-primary text-sm font-semibold flex items-center gap-1"
                    onClick={() => loadGame(game)}
                  >
                    <FaChess size={14} /> Study this game
                  </button>
                </div>
              ))}
            </div>
            
            {filteredGames.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No games match your search. Try different keywords.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl text-primary">{selectedGame.name} ({selectedGame.year})</h2>
              <button
                onClick={() => setSelectedGame(null)}
                className="text-gray-600 hover:text-primary"
              >
                ← Back to list
              </button>
            </div>
            <div className="mb-4 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">White: {selectedGame.white}</div>
                </div>
                <div className="text-xl font-bold">vs</div>
                <div className="text-right">
                  <div className="font-semibold">Black: {selectedGame.black}</div>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{selectedGame.description}</p>
            </div>
          </div>
          
          <div className="w-full">
            <HistoricalGameReplay pgn={selectedGame.pgn} />
          </div>
        </div>
      )}
    </div>
  );
}

// A simplified version of ChessGameReplay that works with historical games
function HistoricalGameReplay({ pgn }: { pgn: string }) {
  const [fen, setFen] = useState<string>("start");
  const [moves, setMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);
  
  useEffect(() => {
    // Initialize the chess position and extract moves
    try {
      const chess = new (require("chess.js").Chess)();
      chess.loadPgn(pgn);
      setMoves(chess.history());
    } catch (error) {
      console.error("Error parsing PGN:", error);
    }
  }, [pgn]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev < moves.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, moves.length, playbackSpeed]);

  useEffect(() => {
    if (currentMoveIndex >= 0 && moves.length > 0) {
      try {
        const chess = new (require("chess.js").Chess)();
        
        // Apply all moves up to currentMoveIndex
        for (let i = 0; i <= currentMoveIndex; i++) {
          chess.move(moves[i]);
        }
        
        setFen(chess.fen());
      } catch (error) {
        console.error("Error applying moves:", error);
      }
    } else {
      setFen("start");
    }
  }, [currentMoveIndex, moves]);

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

  return (
    <div className="w-full flex flex-col md:flex-row items-center md:items-start gap-8">
      <div className="flex flex-col items-center">
        <div className="bg-[#e0e0e0] p-2 rounded-xl shadow-lg" style={{ border: "4px solid #b58863" }}>
          <div style={{ width: 400, height: 400 }}>
            {typeof window !== 'undefined' && (
              <Chessboard
                width={400}
                position={fen}
                boardStyle={{ borderRadius: 8, boxShadow: "0 4px 24px 0 rgba(0,0,0,0.12)" }}
                lightSquareStyle={{ backgroundColor: "#f0d9b5" }}
                darkSquareStyle={{ backgroundColor: "#b58863" }}
                draggable={false}
                transitionDuration={200}
              />
            )}
          </div>
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
      </div>
      <div className="flex flex-col gap-4 w-full max-w-xs">
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
        <div className="flex gap-2 items-center mt-4">
          <span className="font-semibold">Move:</span> {currentMoveIndex + 1} / {moves.length}
        </div>
      </div>
    </div>
  );
} 