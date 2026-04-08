"use client";

import { motion } from "framer-motion";

export default function LoadingAnimation() {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="w-full h-full flex items-center justify-center bg-white">
      <svg width="250" height="250" viewBox="0 0 250 250">
        {/* Background circle */}
        <circle
          cx="125"
          cy="125"
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="8"
          fill="none"
        />

        {/* Animated progress circle - fills the whole circle */}
        <motion.circle
          cx="125"
          cy="125"
          r={radius}
          stroke="#ff3300"
          strokeWidth="28"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, ease: "linear" }}
          style={{ originX: "50%", originY: "50%", rotate: -90 }}
        />
      </svg>
    </div>
  );
}
