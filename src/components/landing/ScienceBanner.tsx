"use client";

import { motion } from "framer-motion";

export default function ScienceBanner() {
  return (
    <section className="py-32 bg-bg-primary relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-active/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ margin: "0px" }}
          transition={{ duration: 0.6 }}
          className="bg-bg-secondary border border-glass-border rounded-3xl p-8 md:p-12 shadow-shadow-card text-center overflow-hidden relative"
        >
          {/* Decorative lines */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-active/50 to-transparent" />
          
          <h2 className="text-4xl md:text-6xl font-display font-bold text-text-primary mb-6">
            Stop Rote Learning. <br className="hidden sm:block" />
            <span className="text-accent-active">Start Retaining.</span>
          </h2>
          
          <p className="text-text-secondary text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Mercury uses a scientifically proven spaced repetition algorithm. By reviewing information at gradually increasing intervals, you interrupt the forgetting curve and build permanent knowledge.
          </p>

          {/* Diagram */}
          <div className="relative max-w-3xl mx-auto h-32 flex items-center justify-between px-4 sm:px-12 mt-8">
            {/* The Curve Line */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M 50 100 Q 200 20 800 10"
                fill="none"
                stroke="var(--color-accent-active)"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.5 }}
                viewport={{ margin: "0px" }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>

            {/* Nodes */}
            {[1, 3, 7, 14, 21].map((day, idx) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ margin: "0px" }}
                transition={{ duration: 0.5, delay: 0.5 + idx * 0.2 }}
                className="flex flex-col items-center relative z-10"
                style={{ marginTop: idx === 0 ? "60px" : idx === 4 ? "-40px" : `${60 - idx * 25}px` }}
              >
                <div className="w-4 h-4 rounded-full bg-accent-active shadow-[0_0_12px_rgba(124,106,247,0.8)] mb-2" />
                <span className="text-xs font-mono text-text-secondary font-medium">Day {day}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
