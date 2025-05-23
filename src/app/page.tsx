'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">
            Krrid
          </Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/plans" className="nav-link">Plans</Link>
            <Link href="/courses" className="nav-link">Courses</Link>
            <Link href="/contact" className="nav-link">Contact Us</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/book-demo" className="btn-primary">Book a Demo</Link>
            <Link href="/auth" className="btn-secondary">Login</Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6 text-center">
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Learn through <br/>
          the <span className="bg-[#25C6F5] px-4">Krrid</span> way!
        </motion.h1>
        <motion.p 
          className="hero-subtitle mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Unlock genius through play. Krrid blends chess, challenges, and learning 
          to transform curiosity into strategic mastery. Ready to make your move?
        </motion.p>
        <motion.div 
          className="mt-10 space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link href="/chess" className="btn-primary">Play</Link>
          <Link href="/courses" className="btn-secondary">Learn</Link>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Benefits Of Chess<br/>For Kids
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              className="benefit-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6">Krrid</h3>
            <p className="text-gray-400">
              Shiddhant Vihar, Gaur City 2,<br/>
              Ghaziabad, Uttar Pradesh<br/>
              201009
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Have Any Questions?</h3>
            <p className="text-gray-400">Please Don't Hesitate To Connect With Us</p>
            <a href="tel:+917309051044" className="text-[#25C6F5] block mt-4">+91 73090 51044</a>
            <a href="mailto:Officialkrrid@Gmail.Com" className="text-[#25C6F5]">Officialkrrid@Gmail.Com</a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white">YouTube</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

const benefits = [
  {
    title: "Empowering Strategic Minds",
    description: "Cultivate planning, foresight, and critical decision-making skills that lay the foundation for academic and personal success."
  },
  {
    title: "Enhancing Social Interaction",
    description: "Promote respectful competition, sportsmanship, and teamwork through interactive, fun chess sessions that connect young minds."
  },
  {
    title: "Boosting Cognitive Abilities",
    description: "Enhance memory, concentration, and problem-solving skill, each move sharpens the mind for smarter learning."
  },
  {
    title: "Interactive & Engaging Experience",
    description: "With Krrid's dynamic platform, learning chess transforms into an immersive journey where every match sparks curiosity, growth, and the joy of discovery."
  },
  {
    title: "Fostering Creativity & Innovation",
    description: "Encourage kids to explore diverse strategies, turning challenges into opportunities and everyday moves into bold breakthroughs."
  }
];