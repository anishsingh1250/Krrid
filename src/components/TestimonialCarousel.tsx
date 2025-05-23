"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Kundan Kumar",
    text: "I had no prior experience with chess, but the structured lessons and live sessions made learning easy and fun! Now, I can confidently play with friends and family. Highly recommended.",
    image: "/student1.png",
  },
  {
    name: "Aarav Singh",
    text: "Krrid's platform is super engaging. The puzzles and tournaments keep me motivated!",
    image: "/student2.png",
  },
  {
    name: "Priya Sharma",
    text: "The teachers are amazing and the lessons are fun. I love the badges and achievements!",
    image: "/student3.png",
  },
];

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className="flex flex-col items-center max-w-2xl w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 rounded-xl p-6 flex flex-col items-center mb-6 min-h-[180px]"
        >
          <Image src={testimonials[index].image} alt={testimonials[index].name} width={60} height={60} className="rounded-full mb-2" />
          <p className="text-lg mb-2 text-center">{testimonials[index].text}</p>
          <span className="font-heading font-semibold">{testimonials[index].name}</span>
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-2 mb-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${i === index ? "bg-primary" : "bg-white/30"}`}
            onClick={() => setIndex(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 