
"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-heading font-bold mb-8">About Krrid</h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Krrid, we believe in making chess education accessible to everyone. Our platform combines traditional chess learning with modern technology to create an engaging and effective learning experience.
            </p>
          </div>
          <div className="relative h-[300px] bg-gray-100 rounded-xl"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-heading font-semibold mb-3">Our Vision</h3>
            <p className="text-gray-600">To become the leading global platform for chess education and player development.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-heading font-semibold mb-3">Our Values</h3>
            <p className="text-gray-600">Excellence, innovation, and accessibility in chess education.</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl">
            <h3 className="text-xl font-heading font-semibold mb-3">Our Impact</h3>
            <p className="text-gray-600">Helping students develop critical thinking and strategic planning skills.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
