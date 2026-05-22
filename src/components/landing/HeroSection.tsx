"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";
import FloatingParticles from "./FloatingParticles";

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with radial gradient */}
      <div className="absolute inset-0 bg-bg-primary z-0" />
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[800px] h-[800px] rounded-full bg-accent-active/10 blur-[120px]" />
      </div>
      
      {/* Floating Particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.span
            variants={itemVariants}
            className="text-sm md:text-base font-semibold tracking-[0.2em] text-text-muted uppercase mb-8"
          >
            The Scientific Learning Companion
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-7xl md:text-9xl font-display font-bold tracking-tight text-text-primary leading-[1.1] mb-8"
          >
            Improve Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-active to-accent-active/80 drop-shadow-[0_0_32px_rgba(124,106,247,0.3)]">
              Learning 10x
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            One place for every skill, every method, every dream. Built on the science of how your brain actually learns.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <Link href="/auth?mode=signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning Free
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                See How It Works
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-bg-primary bg-bg-tertiary flex items-center justify-center overflow-hidden"
                >
                  <div className={`w-full h-full opacity-50 bg-gradient-to-br from-accent-active to-transparent`} />
                </div>
              ))}
            </div>
            <p className="text-sm text-text-muted font-medium">
              Trusted by 12,000+ learners across 40 countries
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
