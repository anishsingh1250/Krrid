"use client";
import { useParams, useRouter } from "next/navigation";
import { useRealtimeChessGame } from "@/hooks/useRealtimeChessGame";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import ChessboardUI from "@/components/ChessboardUI";

export default function MultiplayerGamePage() {
  const params = useParams();
  const gameId = params?.gameId as string;
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth?asPlayer=true");
  }

  const { game, makeMove } = useRealtimeChessGame(gameId, userId!);

  if (!game || !userId) return <div>Loading...</div>;

  if (!game.player_black) {
    return (
      <>
        <div className="w-full flex justify-end mb-4 pr-8 pt-4">
          <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">Sign Out</button>
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-2xl font-heading mb-4">Waiting for another player to join...</div>
          <div className="text-gray-500">Share this link with your friend to join the game:</div>
          <div className="bg-gray-100 rounded px-4 py-2 mt-2 font-mono text-sm select-all">{typeof window !== 'undefined' ? window.location.href : ''}</div>
        </div>
      </>
    );
  }

  // Pass makeMove to ChessboardUI and use game.fen, game.turn, etc.
  return (
    <>
      <div className="w-full flex justify-end mb-4 pr-8 pt-4">
        <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">Sign Out</button>
      </div>
      <ChessboardUI
        fen={game.fen}
        turn={game.turn}
        makeMove={makeMove}
        moves={game.moves}
        userId={userId}
        player_white={game.player_white}
        player_black={game.player_black}
        multiplayer
      />
    </>
  );
} 