"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import MultiplayerLobby from "../MultiplayerLobby";
import { useRouter } from "next/navigation";

export default function ChessMultiplayerPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log("Supabase user data:", data);
      if (!data.user) {
        router.push("/auth");
      } else {
        setUserId(data.user.id);
      }
      setLoading(false);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth?asPlayer=true");
  }

  if (loading) return <div>Loading...</div>;
  if (!userId) return null; // Will redirect

  return (
    <>
      <div className="w-full flex justify-end mb-4 pr-8 pt-4">
        <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">Sign Out</button>
      </div>
      <MultiplayerLobby userId={userId} />
    </>
  );
} 