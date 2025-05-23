
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={index} 
              className="card group hover:scale-105 cursor-pointer"
            >
              <div className="h-48 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl text-primary">♟</span>
                </div>
              </div>
              <h2 className="text-xl font-heading font-semibold mb-2 group-hover:text-primary transition-colors">{course.title}</h2>
              <div className="flex gap-4 text-sm text-gray-600 mb-3">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">{course.level}</span>
                <span className="bg-gray-100 px-3 py-1 rounded-full">{course.duration}</span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <button className="btn-primary w-full">
                Enroll Now
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
