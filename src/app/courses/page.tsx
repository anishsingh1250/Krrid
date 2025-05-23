
"use client";
import Link from "next/link";

export default function CoursesPage() {
  const courses = [
    {
      title: "Beginner's Fundamentals",
      level: "Beginner",
      duration: "4 weeks",
      description: "Learn the basics of chess pieces, moves, and strategies."
    },
    {
      title: "Intermediate Tactics",
      level: "Intermediate",
      duration: "6 weeks",
      description: "Master essential tactical patterns and combinations."
    },
    {
      title: "Advanced Strategy",
      level: "Advanced",
      duration: "8 weeks",
      description: "Deep dive into positional play and strategic planning."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-heading font-bold mb-8">Our Courses</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div key={index} className="border rounded-xl overflow-hidden">
              <div className="h-48 bg-gray-100"></div>
              <div className="p-6">
                <h2 className="text-xl font-heading font-semibold mb-2">{course.title}</h2>
                <div className="flex gap-4 text-sm text-gray-600 mb-3">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <button className="bg-primary text-white rounded-lg px-4 py-2 font-heading">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
