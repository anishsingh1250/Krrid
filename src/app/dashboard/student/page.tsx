"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else if (data.user.user_metadata?.role !== "student") {
        const role = data.user.user_metadata?.role;
        if (role === "teacher" || role === "admin") router.push(`/dashboard/${role}`);
        else router.push("/dashboard");
      } else setUser(data.user);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Placeholder data
  const courses = [
    { name: "Chess Basics", progress: 80 },
    { name: "Tactics & Strategy", progress: 45 },
    { name: "Endgame Mastery", progress: 20 },
  ];
  const classes = [
    { date: "2025-05-20", time: "5:00 PM", topic: "Opening Principles" },
    { date: "2025-05-22", time: "6:00 PM", topic: "Tactical Motifs" },
  ];
  const puzzleStats = { solved: 120, streak: 7, accuracy: 85, easy: 60, medium: 45, hard: 15 };
  const games = [
    { opponent: "Jane Doe", result: "Win", date: "2025-05-10" },
    { opponent: "John Smith", result: "Loss", date: "2025-05-08" },
    { opponent: "AI Bot", result: "Draw", date: "2025-05-05" },
  ];
  const analytics = { rating: [900, 950, 1000, 980, 1020], wins: 12, losses: 8, draws: 3 };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-card p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl mb-1">Welcome, <span className="font-bold text-primary">{user.email}</span>!</h1>
          <p className="text-gray-500">Here's your chess learning journey at a glance.</p>
        </div>
        <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading font-semibold transition-transform duration-200 hover:scale-105 hover:bg-primary/90">Sign Out</button>
      </div>

      {/* Course Progress */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Course Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
              <span className="font-heading font-semibold">{course.name}</span>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full" style={{ width: `${course.progress}%` }}></div>
              </div>
              <span className="text-sm text-gray-500">{course.progress}% complete</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Classes */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Upcoming Classes</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {classes.map((cls, i) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <span className="font-heading font-medium">{cls.topic}</span>
              <span className="text-gray-500 text-sm">{cls.date} • {cls.time}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Puzzle Stats */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Puzzle Stats</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.solved}</span>
            <span className="text-gray-500 text-sm">Solved</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.streak}</span>
            <span className="text-gray-500 text-sm">Streak</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.accuracy}%</span>
            <span className="text-gray-500 text-sm">Accuracy</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.easy}</span>
            <span className="text-gray-500 text-sm">Easy</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.medium}</span>
            <span className="text-gray-500 text-sm">Medium</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{puzzleStats.hard}</span>
            <span className="text-gray-500 text-sm">Hard</span>
          </div>
        </div>
      </section>

      {/* Game History */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Game History</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {games.map((game, i) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <span className="font-heading font-medium">vs {game.opponent}</span>
              <span className={`text-sm font-bold ${game.result === "Win" ? "text-green-600" : game.result === "Loss" ? "text-red-500" : "text-gray-500"}`}>{game.result}</span>
              <span className="text-gray-500 text-sm">{game.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Analytics */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Performance Analytics</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">Rating</span>
            <span className="text-gray-500 text-sm">(last 5 games)</span>
            <div className="flex gap-2 mt-2">
              {analytics.rating.map((r, i) => (
                <span key={i} className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 font-heading font-bold text-primary">{r}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-green-600">{analytics.wins}</span>
            <span className="text-gray-500 text-sm">Wins</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-red-500">{analytics.losses}</span>
            <span className="text-gray-500 text-sm">Losses</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-gray-500">{analytics.draws}</span>
            <span className="text-gray-500 text-sm">Draws</span>
          </div>
        </div>
      </section>
    </div>
  );
} 