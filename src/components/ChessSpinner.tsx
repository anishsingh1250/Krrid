"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ChessSpinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="w-12 h-12"
      >
        {/* Replace with your chess piece SVG or PNG */}
        <Image src="/pawn.png" alt="Loading..." width={48} height={48} />
      </motion.div>
      <span className="mt-2 text-sm text-gray-400 font-heading">Loading...</span>
    </div>
  );
} 