"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    const newMode = mode === "signin" ? "signup" : "signin";
    setMode(newMode);
    setError(null);
    router.replace(`/auth?mode=${newMode}`, { scroll: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const supabase = createClient();
    
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
          },
        });
        if (signUpError) throw signUpError;
        router.push("/dashboard");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push("/")}
        className="mb-6 flex items-center gap-2 text-sm text-text-secondary hover:text-accent-active transition-colors duration-200 group/back cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover/back:-translate-x-1" />
        Back to Home
      </button>

      <div className="mb-10 text-center">
        <div className="flex justify-center mb-6">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain" />
          </div>
        </div>
        <h2 className="text-3xl font-display font-bold text-text-primary mb-2">
          {mode === "signin" ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-text-secondary">
          {mode === "signin"
            ? "Enter your details to access your dashboard."
            : "Join Mercury and start learning scientifically."}
        </p>
      </div>

      <div className="bg-bg-secondary border border-glass-border rounded-2xl p-8 shadow-shadow-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {mode === "signup" && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
                  <User className="w-5 h-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="pl-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <Mail className="w-5 h-5" />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              className="pl-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted">
              <Lock className="w-5 h-5" />
            </div>
            <Input
              type="password"
              placeholder="Password"
              className="pl-11"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-accent-red/10 border border-accent-red/20 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
              <p className="text-sm text-accent-red">{error}</p>
            </motion.div>
          )}

          {mode === "signin" && (
            <div className="flex justify-end">
              <button type="button" className="text-xs text-accent-active hover:underline font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full mt-2 h-12 text-base group">
            {isLoading ? "Please wait..." : mode === "signin" ? "Sign In" : "Sign Up"}
            {!isLoading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-text-secondary">
            {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={toggleMode} className="text-accent-active font-semibold hover:underline">
            {mode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </div>

        {/* Demo Bypass Link */}
        <div className="mt-6 text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/dashboard")}
            className="text-xs border border-dashed border-accent-active/50 text-accent-active w-full"
          >
            [Demo] Bypass Auth to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
