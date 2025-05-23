
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0
  });

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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-primary">{stats.totalStudents}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Total Teachers</h3>
              <p className="text-3xl font-bold text-primary">{stats.totalTeachers}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Active Courses</h3>
              <p className="text-3xl font-bold text-primary">{stats.activeCourses}</p>
            </div>
          </div>
        );

      case "users":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Add user rows here */}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "assignments":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold mb-4">Assignment Management</h3>
            <div className="space-y-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg">
                Create New Assignment
              </button>
              <div className="border rounded-lg p-4">
                {/* Assignment creation form */}
                <form className="space-y-4">
                  <div>
                    <label className="block mb-1">Title</label>
                    <input type="text" className="w-full border rounded px-3 py-2" />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea className="w-full border rounded px-3 py-2" rows={4}></textarea>
                  </div>
                  <div>
                    <label className="block mb-1">Assign To</label>
                    <select className="w-full border rounded px-3 py-2">
                      <option>Select Teacher/Student</option>
                    </select>
                  </div>
                  <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg">
                    Assign
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-heading font-bold">Admin Dashboard</h1>
          <button onClick={handleSignOut} className="bg-black text-white rounded-lg px-4 py-2 font-heading">
            Sign Out
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg ${activeTab === "overview" ? "bg-primary text-white" : "bg-white"}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-lg ${activeTab === "users" ? "bg-primary text-white" : "bg-white"}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`px-4 py-2 rounded-lg ${activeTab === "assignments" ? "bg-primary text-white" : "bg-white"}`}
          >
            Assignments
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
