"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else if (data.user.user_metadata?.role !== "admin") {
        const role = data.user.user_metadata?.role;
        if (role === "student" || role === "teacher") router.push(`/dashboard/${role}`);
        else router.push("/dashboard");
      } else setUser(data.user);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-heading text-3xl mb-4">Admin Dashboard</h1>
      <p className="mb-2">Welcome, <span className="font-bold">{user.email}</span>!</p>
      <div className="mb-6 text-center">
        <p className="mb-2">Manage users, payments, site metrics, and content moderation here.</p>
        <p className="text-primary font-heading">(Admin-specific features coming soon!)</p>
      </div>
      <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">Sign Out</button>
    </div>
  );
} 