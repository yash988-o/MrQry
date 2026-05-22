"use client";

import { motion } from "framer-motion";
import { Calendar, Timer, Sparkles, Calculator, BarChart3, BrainCircuit } from "lucide-react";
import Card from "@/components/ui/Card";

export default function FeatureStrip() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-accent-violet" />,
      title: "Spaced Repetition",
      description: "Automated revision scheduling based on the SM-2 algorithm.",
    },
    {
      icon: <Timer className="w-6 h-6 text-accent-green" />,
      title: "Focus Timer",
      description: "Stay in flow while your digital companion grows with you.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-ghalib-orange" />,
      title: "AI Learning Companion",
      description: "Ask questions, explore concepts, and break down complex problems step-by-step.",
    },
    {
      icon: <Calculator className="w-6 h-6 text-text-primary" />,
      title: "Universal Calculator",
      description: "Basic, scientific, graphing, and unit conversions in one place.",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-accent-amber" />,
      title: "Progress Reports",
      description: "Visualize your learning journey with rich data and AI summaries.",
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-mukki-cyan" />,
      title: "Flashcard Generator",
      description: "Create smart flashcards manually or let AI generate them from notes.",
    },
  ];

  return (
    <section id="features" className="py-32 bg-bg-secondary relative border-y border-glass-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-6">Everything You Need</h2>
          <p className="text-text-secondary text-lg md:text-xl max-w-2xl mx-auto">
            Replace your scattered tools with one unified learning operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card glass className="h-full flex flex-col hover:scale-[1.02] transition-transform duration-300 p-8">
                <div className="w-16 h-16 rounded-xl bg-bg-tertiary border border-glass-border flex items-center justify-center mb-8">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-text-primary mb-4">{feature.title}</h3>
                <p className="text-text-secondary text-base leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
