import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabaseClient";

export function useRealtimeChessGame(gameId: string, userId: string) {
  const [game, setGame] = useState<any>(null);

  // Fetch initial game state
  useEffect(() => {
    if (!gameId) return;
    supabase.from("games").select("*").eq("id", gameId).single().then(({ data }) => setGame(data));
  }, [gameId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!gameId) return;
    const channel = supabase
      .channel("realtime:games")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "games", filter: `id=eq.${gameId}` },
        (payload) => {
          setGame(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  // Make a move
  const makeMove = useCallback(
    async (fen: string, move: any, turn: string) => {
      if (!gameId) return;
      await supabase
        .from("games")
        .update({
          fen,
          moves: [...(game?.moves || []), move],
          turn,
        })
        .eq("id", gameId);
    },
    [gameId, game]
  );

  return { game, makeMove };
} 