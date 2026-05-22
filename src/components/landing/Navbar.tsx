"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-bg-primary/80 backdrop-blur-md border-b border-glass-border py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            onClick={(e) => scrollToSection(e, "features")}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => scrollToSection(e, "how-it-works")}
            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            How It Works
          </a>
          <Link
            href="/auth?mode=signin"
            className="text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
          >
            Sign In
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/auth?mode=signup">
            <Button variant="primary" size="sm" className="hidden sm:flex">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
