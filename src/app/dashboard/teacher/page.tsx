"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/auth");
      else if (data.user.user_metadata?.role !== "teacher") {
        const role = data.user.user_metadata?.role;
        if (role === "student" || role === "admin") router.push(`/dashboard/${role}`);
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
  const students = [
    { name: "Alice", progress: 80, lastActive: "2025-05-15" },
    { name: "Bob", progress: 60, lastActive: "2025-05-14" },
    { name: "Charlie", progress: 40, lastActive: "2025-05-13" },
  ];
  const classes = [
    { date: "2025-05-20", time: "5:00 PM", topic: "Opening Principles" },
    { date: "2025-05-22", time: "6:00 PM", topic: "Tactical Motifs" },
  ];
  const courses = [
    { title: "Chess Basics", lessons: 12 },
    { title: "Tactics & Strategy", lessons: 18 },
  ];
  const analytics = { avgProgress: 60, activeStudents: 12, totalClasses: 8 };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-card p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl mb-1">Welcome, <span className="font-bold text-primary">{user.email}</span>!</h1>
          <p className="text-gray-500">Manage your students, classes, and courses here.</p>
        </div>
        <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading font-semibold transition-transform duration-200 hover:scale-105 hover:bg-primary/90">Sign Out</button>
      </div>

      {/* Student Management */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Student Management</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {students.map((student, i) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <span className="font-heading font-medium">{student.name}</span>
              <span className="text-gray-500 text-sm">Progress: {student.progress}%</span>
              <span className="text-gray-400 text-xs">Last active: {student.lastActive}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Class Scheduling */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Class Scheduling</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {classes.map((cls, i) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <span className="font-heading font-medium">{cls.topic}</span>
              <span className="text-gray-500 text-sm">{cls.date} • {cls.time}</span>
              <button className="bg-primary text-white rounded px-3 py-1 text-xs font-heading hover:bg-primary/80">Edit</button>
            </div>
          ))}
          <button className="mt-3 bg-black text-white rounded-lg px-4 py-2 font-heading text-sm hover:bg-primary/90">+ Add New Class</button>
        </div>
      </section>

      {/* Course Content Creation */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Course Content</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
          {courses.map((course, i) => (
            <div key={i} className="flex justify-between items-center border-b last:border-b-0 py-2">
              <span className="font-heading font-medium">{course.title}</span>
              <span className="text-gray-500 text-sm">Lessons: {course.lessons}</span>
              <button className="bg-primary text-white rounded px-3 py-1 text-xs font-heading hover:bg-primary/80">Edit</button>
            </div>
          ))}
          <button className="mt-3 bg-black text-white rounded-lg px-4 py-2 font-heading text-sm hover:bg-primary/90">+ Add New Course</button>
        </div>
      </section>

      {/* Performance Tracking */}
      <section className="w-full max-w-4xl mb-8">
        <h2 className="font-heading text-xl mb-4 text-primary">Performance Tracking</h2>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{analytics.avgProgress}%</span>
            <span className="text-gray-500 text-sm">Avg. Student Progress</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{analytics.activeStudents}</span>
            <span className="text-gray-500 text-sm">Active Students</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-heading text-2xl text-primary">{analytics.totalClasses}</span>
            <span className="text-gray-500 text-sm">Total Classes</span>
          </div>
        </div>
      </section>
    </div>
  );
} 