"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else setUser(data.user);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-heading text-3xl mb-4">Welcome to your Dashboard!</h1>
      <p className="mb-6">Email: {user.email}</p>
      <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">Sign Out</button>
    </div>
  );
} 