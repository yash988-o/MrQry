"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Add Your Tasks",
      description: "Set what you want to learn, its priority, and how much it's worth to you. Organize everything in one unified dashboard.",
    },
    {
      number: "02",
      title: "Study with Focus",
      description: "Use the floating timer, let your digital companion grow as you study, and stay in flow without distractions.",
    },
    {
      number: "03",
      title: "Revise Scientifically",
      description: "Mercury schedules your revisions automatically using spaced repetition. Rate your confidence, and we'll do the rest.",
    },
  ];

  return (
    <section id="how-it-works" className="py-40 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "0px" }}
            className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-6"
          >
            Learn the Way Your Brain Is <br className="hidden md:block" />
            <span className="text-accent-active">Built For</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-px bg-glass-border -z-10" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className="w-24 h-24 rounded-full bg-bg-secondary border border-glass-border shadow-shadow-card flex items-center justify-center mb-8 relative">
                <span className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-active to-accent-active/50">
                  {step.number}
                </span>
                {/* Glow behind number */}
                <div className="absolute inset-0 rounded-full bg-accent-active/10 blur-xl -z-10" />
              </div>
              
              <h3 className="text-3xl font-semibold text-text-primary mb-4">{step.title}</h3>
              <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
