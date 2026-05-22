"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type ThemeContextType = {
  accentColor: string;
  setAccentColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useLocalStorage("mrqry-accent-v2", "#7C6AF7");

  useEffect(() => {
    // Update the CSS variables on the root element
    const root = document.documentElement;
    root.style.setProperty("--accent-active", accentColor);
    
    // Calculate a glow version of the hex color (assuming 6 char hex)
    // Add 40 (25% opacity) to the hex to create an rgba equivalent in hex if supported, 
    // but standard CSS is easier with a simple hack or just using the hex directly for shadows.
    // For simplicity, we can set the glow variable using a slightly faded approach 
    // if we needed to, but let's just keep the hex for now and handle glow differently.
    // Actually, hex with alpha: 40 is 25% opacity. Let's append "40".
    if (accentColor.length === 7) {
      root.style.setProperty("--accent-active-glow", `${accentColor}40`);
    }
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAccentColor() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAccentColor must be used within a ThemeProvider");
  }
  return context;
}
