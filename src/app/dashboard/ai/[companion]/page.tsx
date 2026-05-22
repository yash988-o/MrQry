"use client";

import { use, useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Brain, Heart, Send } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type CompanionKey = "mukki" | "ghalib" | "zadugarni";

const COMPANIONS: Record<CompanionKey, { name: string; color: string; icon: React.ReactNode; greeting: string; placeholder: string }> = {
  mukki: {
    name: "Mukki",
    color: "var(--mukki-cyan)",
    icon: <img src="/mukki.png" alt="Mukki" className="w-full h-full object-cover" />,
    greeting: "Hi, I'm Mukki. What topic do you need the best lecture for?",
    placeholder: "Search for a topic (e.g., Quantum Mechanics)..."
  },
  ghalib: {
    name: "Ghalib",
    color: "var(--ghalib-orange)",
    icon: <img src="/ghalib.png" alt="Ghalib" className="w-full h-full object-cover" />,
    greeting: "I am Ghalib. What topic, concept, or problem are we exploring today?",
    placeholder: "Type a query, paste a problem, or upload a diagram..."
  },
  zadugarni: {
    name: "Zadugarni",
    color: "var(--zadugarni-pink)",
    icon: <img src="/zadugarni.png" alt="Zadugarni" className="w-full h-full object-cover" />,
    greeting: "Hello dear. Take a deep breath. How are you feeling today?",
    placeholder: "Share your thoughts..."
  }
};

export default function CompanionPage({ params }: { params: Promise<{ companion: string }> }) {
  const resolvedParams = use(params);
  const companionKey = resolvedParams.companion.toLowerCase() as CompanionKey;
  
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!COMPANIONS[companionKey]) {
    notFound();
  }

  const ai = COMPANIONS[companionKey];

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg,
          companionType: companionKey,
        }),
      });
      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
      } else if (data.error) {
        setMessages(prev => [...prev, { role: 'model', content: `Error: ${data.error}` }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I couldn't connect to my brain right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-glass-border shadow-shadow-card flex items-center justify-center overflow-hidden shrink-0" style={{ borderColor: ai.color, boxShadow: `0 0 20px ${ai.color}20` }}>
          {ai.icon}
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold" style={{ color: ai.color }}>{ai.name}</h1>
          <p className="text-text-secondary text-sm">Your AI Companion</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden mb-6 border-glass-border" style={{ boxShadow: `0 4px 24px ${ai.color}10` }}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* AI Greeting Message */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 overflow-hidden" style={{ border: `1px solid ${ai.color}` }}>
              {ai.icon}
            </div>
            <div className="bg-bg-tertiary border border-glass-border rounded-2xl rounded-tl-sm p-4 text-text-primary max-w-[80%]">
              {ai.greeting}
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 overflow-hidden" style={{ border: `1px solid ${ai.color}` }}>
                  {ai.icon}
                </div>
              )}
              <div className={`border border-glass-border p-4 max-w-[80%] whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-accent-active/10 text-text-primary rounded-2xl rounded-tr-sm' 
                  : 'bg-bg-tertiary text-text-primary rounded-2xl rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 overflow-hidden" style={{ border: `1px solid ${ai.color}` }}>
                {ai.icon}
              </div>
              <div className="bg-bg-tertiary border border-glass-border rounded-2xl rounded-tl-sm p-4 text-text-muted max-w-[80%] flex items-center gap-1">
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-current" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-glass-border bg-bg-tertiary/50">
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="relative flex items-center"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ai.placeholder} 
              className="pr-12 h-12 rounded-full bg-bg-secondary"
            />
            <Button 
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm" 
              className="absolute right-1.5 h-9 w-9 p-0 rounded-full flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
