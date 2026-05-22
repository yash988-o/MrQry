"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CTAFooter() {
  return (
    <footer className="bg-bg-primary pt-40 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[400px] bg-accent-active/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "0px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-8">
            Ready to transform <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-active to-accent-active/70">
              how you learn?
            </span>
          </h2>
          <Link href="/auth?mode=signup">
            <Button size="lg" className="px-12 py-5 text-xl">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between py-6 border-t border-glass-border">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <img src="/logo.png" alt="Logo" className="h-6 w-auto object-contain" />
          </div>

          <div className="flex items-center gap-6 mb-4 md:mb-0">
            <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">About</Link>
            <Link href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Features</Link>
            <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Privacy</Link>
            <Link href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Contact</Link>
          </div>

          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Built for learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
