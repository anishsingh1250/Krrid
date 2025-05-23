"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import ChessPuzzle from "@/components/ChessPuzzle";
import ChessGameReplay from "@/components/ChessGameReplay";
import MasterGames from "@/components/MasterGames";
import { FaChessBoard, FaPuzzlePiece, FaHistory, FaGraduationCap, FaUsers } from "react-icons/fa";
import DndProviderWrapper from "@/components/DndProviderWrapper";
import { useRouter } from "next/navigation";

// Dynamically import ChessboardUI to avoid SSR issues
const Chessboard = dynamic(() => import("@/components/ChessboardUI"), { ssr: false });

export default function ChessPage() {
  const [tab, setTab] = useState<"play" | "puzzle" | "replay" | "study">("play");
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#f0d9b5] py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-5xl bg-white/90 rounded-3xl shadow-2xl p-8 mb-6 flex flex-col items-center border border-[#e0e0e0]">
        <h1 className="font-heading text-3xl md:text-4xl mb-6 text-primary drop-shadow font-bold tracking-tight">Chess Playground</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8 justify-center">
          <button
            onClick={() => setTab("play")}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-heading text-lg font-semibold transition-all duration-200 shadow-md border-2 ${tab === "play" ? "bg-primary text-white border-primary scale-105" : "bg-gray-100 text-black border-transparent hover:bg-primary/10 hover:scale-105"}`}
          >
            <FaChessBoard /> Play
          </button>
          <button
            onClick={() => setTab("puzzle")}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-heading text-lg font-semibold transition-all duration-200 shadow-md border-2 ${tab === "puzzle" ? "bg-primary text-white border-primary scale-105" : "bg-gray-100 text-black border-transparent hover:bg-primary/10 hover:scale-105"}`}
          >
            <FaPuzzlePiece /> Puzzles
          </button>
          <button
            onClick={() => setTab("replay")}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-heading text-lg font-semibold transition-all duration-200 shadow-md border-2 ${tab === "replay" ? "bg-primary text-white border-primary scale-105" : "bg-gray-100 text-black border-transparent hover:bg-primary/10 hover:scale-105"}`}
          >
            <FaHistory /> Replay
          </button>
          <button
            onClick={() => setTab("study")}
            className={`flex items-center gap-2 px-7 py-3 rounded-full font-heading text-lg font-semibold transition-all duration-200 shadow-md border-2 ${tab === "study" ? "bg-primary text-white border-primary scale-105" : "bg-gray-100 text-black border-transparent hover:bg-primary/10 hover:scale-105"}`}
          >
            <FaGraduationCap /> Study
          </button>
          <button
            onClick={() => router.push("/auth?asPlayer=true")}
            className="flex items-center gap-2 px-7 py-3 rounded-full font-heading text-lg font-semibold transition-all duration-200 shadow-md border-2 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:scale-105"
          >
            <FaUsers /> Multiplayer
          </button>
        </div>
        <div className="w-full flex flex-col items-center min-h-[600px]">
          {tab === "play" && (
            <div className="w-full flex flex-col items-center">
              <Chessboard />
              <p className="mt-6 text-gray-600 text-lg font-medium">Play against AI or a friend. <span className="italic">(Coming soon: matchmaking!)</span></p>
            </div>
          )}
          {tab === "puzzle" && (
            <div className="w-full flex flex-col items-center">
              <ChessPuzzle />
            </div>
          )}
          {tab === "replay" && (
            <div className="w-full flex flex-col items-center">
              <ChessGameReplay />
            </div>
          )}
          {tab === "study" && (
            <div className="w-full flex flex-col items-center">
              <MasterGames />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}