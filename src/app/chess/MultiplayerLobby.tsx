"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

export default function MultiplayerLobby({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function createGame() {
    setLoading(true);
    const startingFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    const { data, error } = await supabase
      .from("games")
      .insert([{ player_white: userId, fen: startingFEN }])
      .select()
      .single();
    setLoading(false);
    if (data) {
      router.push(`/chess/multiplayer/${data.id}`);
    }
  }

  async function joinGame() {
    setLoading(true);
    // Find a waiting game
    const { data: games } = await supabase
      .from("games")
      .select("*")
      .eq("status", "waiting")
      .neq("player_white", userId)
      .limit(1);
    if (games && games.length > 0) {
      const game = games[0];
      await supabase
        .from("games")
        .update({ player_black: userId, status: "active" })
        .eq("id", game.id);
      router.push(`/chess/multiplayer/${game.id}`);
    } else {
      alert("No available games to join. Try creating one!");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-4 items-center mt-8">
      <button onClick={createGame} disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg">Create Game</button>
      <button onClick={joinGame} disabled={loading} className="bg-black text-white px-6 py-2 rounded-lg">Join Game</button>
    </div>
  );
} 