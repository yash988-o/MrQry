"use client";

import { motion } from "framer-motion";
import { Search, Brain, Heart } from "lucide-react";

export default function AICompanions() {
  const companions = [
    {
      id: "mukki",
      name: "Mukki",
      colorClass: "text-mukki-cyan",
      borderClass: "hover:border-mukki-cyan/50",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]",
      icon: <img src="/mukki.png" alt="Mukki" className="w-full h-full object-cover rounded-2xl" />,
      description: "Finds the best lecture on any topic, anywhere on the internet, matched to your preferences.",
    },
    {
      id: "ghalib",
      name: "Ghalib",
      colorClass: "text-ghalib-orange",
      borderClass: "hover:border-ghalib-orange/50",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(251,146,60,0.2)]",
      icon: <img src="/ghalib.png" alt="Ghalib" className="w-full h-full object-cover rounded-2xl" />,
      description: "Break down complex academic questions, explain concepts, and solve problems with optional image uploads.",
    },
    {
      id: "zadugarni",
      name: "Zadugarni",
      colorClass: "text-zadugarni-pink",
      borderClass: "hover:border-zadugarni-pink/50",
      glowClass: "group-hover:shadow-[0_0_30px_rgba(244,114,182,0.2)]",
      icon: <img src="/zadugarni.png" alt="Zadugarni" className="w-full h-full object-cover rounded-2xl" />,
      description: "Feeling anxious? Burnt out? Zadugarni is your calm, caring study companion.",
    },
  ];

  return (
    <section className="py-32 bg-bg-secondary border-t border-glass-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "0px" }}
            className="text-4xl md:text-6xl font-display font-bold text-text-primary mb-6"
          >
            Three AI Companions. <br className="hidden md:block" />
            <span className="text-text-muted">One Mission.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companions.map((ai, idx) => (
            <motion.div
              key={ai.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`group relative bg-bg-tertiary border border-glass-border rounded-2xl p-10 transition-all duration-500 ${ai.borderClass} ${ai.glowClass}`}
            >
              {/* Background Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-2xl bg-bg-primary border border-glass-border flex items-center justify-center mb-6 shadow-shadow-card transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2`}>
                  {ai.icon}
                </div>
                <h3 className={`text-3xl font-display font-bold mb-4 ${ai.colorClass}`}>
                  {ai.name}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {ai.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
