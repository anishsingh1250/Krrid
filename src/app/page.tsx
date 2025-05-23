'use client';
import { useState, useEffect, useRef, RefObject } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import ChessSpinner from "@/components/ChessSpinner";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabaseClient";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");
  const aboutRef = useRef(null);
  const plansRef = useRef(null);
  const coursesRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const timer = setTimeout(() => setLoading(false), 2000);
    // Scroll listener for active section
    const handleScroll = () => {
      const sections = [
        { id: "about", ref: aboutRef },
        { id: "plans", ref: plansRef },
        { id: "courses", ref: coursesRef },
        { id: "contact", ref: contactRef },
      ];
      const scrollY = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const ref = sections[i].ref.current as HTMLElement | null;
        if (ref && ref.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (ref: RefObject<any>) => {
    if (ref.current) {
      (ref.current as HTMLElement).scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <ChessSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-body">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 z-50 bg-white/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Krrid Logo" width={80} height={40} />
        </div>
        <ul className="hidden md:flex gap-8 font-heading text-black text-sm">
          <li className={`transition-colors duration-200 cursor-pointer ${activeSection === "about" ? "text-primary font-bold" : "hover:text-primary"}`} onClick={() => scrollToSection(aboutRef)}>About Us</li>
          <li className={`transition-colors duration-200 cursor-pointer ${activeSection === "plans" ? "text-primary font-bold" : "hover:text-primary"}`} onClick={() => scrollToSection(plansRef)}>Plans</li>
          <li className={`transition-colors duration-200 cursor-pointer ${activeSection === "courses" ? "text-primary font-bold" : "hover:text-primary"}`} onClick={() => scrollToSection(coursesRef)}>Courses</li>
          <li className={`transition-colors duration-200 cursor-pointer ${activeSection === "contact" ? "text-primary font-bold" : "hover:text-primary"}`} onClick={() => scrollToSection(contactRef)}>Contact Us</li>
        </ul>
        <div className="flex gap-3">
          <Link href="/auth">
            <button className="bg-primary text-white rounded-lg px-5 py-2 font-heading text-base font-semibold shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/60">Sign Up / Login</button>
          </Link>
          <button className="bg-black text-white rounded-lg px-5 py-2 font-heading text-base font-semibold transition-transform duration-200 hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60">Book a Demo</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="flex flex-col items-center text-center py-12 px-4 bg-gradient-to-b from-primary/10 to-white relative overflow-hidden">
        <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-4">
          Learn through <br />
          the <span className="bg-red-500 px-2 italic font-special text-primary">Krrid</span> way!
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-6 text-lg">
          Unlock genius through play. Krrid blends chess, challenges, and learning to transform curiosity into strategic mastery. Ready to make your move?
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <button
            className="bg-black text-white rounded-lg px-8 py-2 font-heading text-lg font-semibold shadow-md transition-transform duration-200 hover:scale-105 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/60 ripple"
            onClick={e => { e.currentTarget.classList.add('ripple-animate'); setTimeout(() => e.currentTarget.classList.remove('ripple-animate'), 400); router.push("/chess"); }}
          >
            Play
          </button>
          <button
            className="bg-gray-100 text-black rounded-lg px-8 py-2 font-heading text-lg font-semibold border border-gray-300 shadow-md transition-transform duration-200 hover:scale-105 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/60 ripple"
            onClick={e => { e.currentTarget.classList.add('ripple-animate'); setTimeout(() => e.currentTarget.classList.remove('ripple-animate'), 400); router.push("/auth"); }}
          >
            Learn
          </button>
        </div>
        <div className="w-full flex justify-center">
          <Image src="/chessboard-hero.png" alt="Chessboard" width={700} height={300} className="rounded-xl shadow-card drop-shadow-[0_0_40px_rgba(37,198,245,0.25)]" />
        </div>
      </section>

      {/* Turn Pawns Into Queens Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 bg-white flex flex-col items-center"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-black text-center mb-2">Turn Pawns Into Queens With Us!</h2>
        <p className="text-gray-400 text-center max-w-lg mb-6">Chess sharpens critical thinking, improve focus, and problem solving skills for school and life!</p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <span className="bg-primary/20 px-4 py-2 rounded-lg font-heading text-black">Expert strategies</span>
          <span className="bg-primary/20 px-4 py-2 rounded-lg font-heading text-black">AI & real matches</span>
          <span className="bg-primary/20 px-4 py-2 rounded-lg font-heading text-black">Interactive lessons</span>
          <span className="bg-primary/20 px-4 py-2 rounded-lg font-heading text-black">Tactical puzzles</span>
          <span className="bg-primary/20 px-4 py-2 rounded-lg font-heading text-black">Tournaments & leaderboards</span>
        </div>
        <ParallaxChessPieces />
      </motion.section>

      {/* Benefits Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 bg-white flex flex-col items-center"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-black text-center mb-10">Benefits Of Chess For Kids</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mb-6">
          <div className="bg-gray-100 rounded-xl shadow-card p-6 flex flex-col items-start">
            <h3 className="font-heading font-semibold text-lg mb-2">Empowering Strategic Minds:</h3>
            <p className="text-gray-400 mb-4">Cultivate planning, foresight, and critical decision-making skills that lay the foundation for academic and personal success.</p>
            <Image src="/benefit-book.png" alt="Book" width={80} height={80} />
          </div>
          <div className="bg-black text-white rounded-xl shadow-card p-6 flex flex-col items-start">
            <h3 className="font-heading font-semibold text-lg mb-2">Enhancing Social Interaction:</h3>
            <p className="text-gray-100 mb-4">Promote respectful competition, sportsmanship, and teamwork through interactive, fun chess sessions that connect young minds.</p>
            <Image src="/benefit-social.png" alt="Social" width={80} height={80} />
          </div>
          <div className="bg-gray-100 rounded-xl shadow-card p-6 flex flex-col items-start">
            <h3 className="font-heading font-semibold text-lg mb-2">Boosting Cognitive Abilities:</h3>
            <p className="text-gray-400 mb-4">Enhance memory, concentration, and problem-solving skill , each move sharpens the mind for smarter learning.</p>
            <Image src="/benefit-cognitive.png" alt="Cognitive" width={80} height={80} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <div className="bg-gray-100 rounded-xl shadow-card p-6 flex flex-col items-start">
            <h3 className="font-heading font-semibold text-lg mb-2">Interactive & Engaging Experience:</h3>
            <p className="text-gray-400 mb-4">With Krrid's dynamic platform, learning chess transforms into an immersive journey where every match sparks curiosity, growth, and the joy of discovery.</p>
            <Image src="/benefit-engage.png" alt="Engage" width={80} height={80} />
          </div>
          <div className="bg-gray-100 rounded-xl shadow-card p-6 flex flex-col items-start">
            <h3 className="font-heading font-semibold text-lg mb-2">Fostering Creativity & Innovation:</h3>
            <p className="text-gray-400 mb-4">Encourage kids to explore diverse strategies, turning challenges into opportunities and everyday moves into bold breakthroughs.</p>
            <Image src="/benefit-creative.png" alt="Creative" width={80} height={80} />
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 bg-black text-white flex flex-col items-center rounded-t-[3rem]"
      >
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center mb-8">What Our Students Say</h2>
        <TestimonialCarousel />
        <div className="flex gap-6">
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Image src="/yt1.png" alt="YouTube" width={40} height={40} />
          </div>
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Image src="/yt2.png" alt="YouTube" width={40} height={40} />
          </div>
          <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
            <Image src="/yt3.png" alt="YouTube" width={40} height={40} />
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="py-16 px-4 bg-white flex flex-col items-center"
      >
        <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl">
          <div className="flex-1 flex flex-col gap-4 items-start">
            <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-heading mb-2">FAQs</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-2">Have Questions? We've Got You!</h2>
            <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-4 mb-2">
              <Image src="/coach.png" alt="Coach" width={48} height={48} className="rounded-full" />
              <span className="font-heading text-sm">Trust The Process, And You'll See Progress In No Time <span className="text-accent">♥</span></span>
            </div>
            <p className="text-black text-sm mb-4">Feel free to reach out, we're here to assist you anytime!</p>
            <button className="bg-black text-white rounded-lg px-6 py-2 font-heading text-base">Contact Us</button>
          </div>
          <div className="flex-1 flex flex-col gap-4">
            {/* FAQ Accordions (static for now) */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center font-heading font-semibold text-base mb-2">I Am A Complete Beginner. Can I Join Krrid?<span className="cursor-pointer">×</span></div>
              <p className="text-gray-400 text-sm">Absolutely! We Offer Personalized Coaching For All Levels, From Beginners To Advanced Players. If You're Unsure About Your Level, Share Your 'chess.Com' Or 'Lichess' ID, And We'll Recommend The Best Training Program For You</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center font-heading font-semibold text-base mb-2">How Long Does It Take To See Improvement In My Chess Skills?<span className="cursor-pointer">×</span></div>
              <p className="text-gray-400 text-sm">Progress Varies Based On Practice, Consistency, And Learning Pace. However, With Regular Training, Structured Lessons, And Weekly Tasks, Most Students Notice Significant Improvement Within A Few Months.</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center font-heading font-semibold text-base mb-2">Do You Offer Trial Classes Before Enrollment?<span className="cursor-pointer">+</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center font-heading font-semibold text-base mb-2">How Long Does It Take To See Improvement In My Chess Skills?<span className="cursor-pointer">+</span></div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex justify-between items-center font-heading font-semibold text-base mb-2">How Long Does It Take To See Improvement In My Chess Skills?<span className="cursor-pointer">+</span></div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-white py-10 px-4 rounded-t-[3rem] mt-10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-8">
          <div className="flex flex-col gap-2 items-start">
            <Image src="/logo.svg" alt="Krrid Logo" width={80} height={40} />
            <span className="text-sm">Shiddhart Vihar, Gaur City 2,<br />Ghaziabad, Uttar Pradesh<br />201009</span>
            <div className="flex gap-3 mt-2">
              <Image src="/ig.svg" alt="Instagram" width={20} height={20} />
              <Image src="/fb.svg" alt="Facebook" width={20} height={20} />
              <Image src="/x.svg" alt="X" width={20} height={20} />
              <Image src="/yt.svg" alt="YouTube" width={20} height={20} />
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start">
            <span className="font-heading text-lg">Have Any Questions?<br />Please Don't Hesitate To Connect With Us -</span>
            <span className="bg-primary text-white px-3 py-1 rounded font-heading">+91 73090 51044</span>
            <span className="bg-primary text-white px-3 py-1 rounded font-heading">Officialkrrid@Gmail.Com</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto mt-8 border-t border-primary pt-4 text-xs text-white/80">
          <span>Copyright © 2025 Krrid</span>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Refund Policy</span>
            <span>Terms and Conditions</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ParallaxChessPieces() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Parallax: pawn moves less, queen moves more
  const pawnY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const queenY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div ref={ref} className="flex justify-between w-full max-w-4xl">
      <motion.div
        style={{ y: pawnY }}
        animate={{ y: [0, -20, 0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        <Image src="/pawn.png" alt="Pawn" width={120} height={180} />
      </motion.div>
      <motion.div
        style={{ y: queenY }}
        animate={{ y: [0, -30, 0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
      >
        <Image src="/queen.png" alt="Queen" width={120} height={180} />
      </motion.div>
    </div>
  );
}
