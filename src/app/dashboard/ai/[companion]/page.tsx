"use client";

import { use, useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Brain, Heart, Send, Trash2, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";

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
  
  type Message = { role: 'user' | 'model'; content: string; imageBase64?: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(`mrqry_chat_${companionKey}`);
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    setIsInitialized(true);
  }, [companionKey]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`mrqry_chat_${companionKey}`, JSON.stringify(messages));
    }
  }, [messages, isInitialized, companionKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!COMPANIONS[companionKey]) {
    notFound();
  }

  const ai = COMPANIONS[companionKey];

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (!file) continue;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageBase64(event.target?.result as string);
        };
        reader.readAsDataURL(file);
        break;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImageBase64(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast({ title: "Only image files are supported.", type: "error" });
      }
    }
  };

  const deleteMessage = (index: number) => {
    setMessages(prev => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async () => {
    if ((!input.trim() && !imageBase64) || isLoading) return;
    const userMsg = input.trim();
    const currentImage = imageBase64;
    
    setInput("");
    setImageBase64(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg, imageBase64: currentImage || undefined }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: userMsg || "Please analyze this image.",
          companionType: companionKey,
          imageBase64: currentImage || undefined
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-glass-border shadow-shadow-card flex items-center justify-center overflow-hidden shrink-0" style={{ borderColor: ai.color, boxShadow: `0 0 20px ${ai.color}20` }}>
            {ai.icon}
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold" style={{ color: ai.color }}>{ai.name}</h1>
            <p className="text-text-secondary text-sm">Your AI Companion</p>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => {
            if (confirm("Are you sure you want to completely clear this conversation?")) {
              setMessages([]);
              localStorage.removeItem(`mrqry_chat_${companionKey}`);
            }
          }}
          className="text-text-muted hover:text-accent-red hover:bg-accent-red/10 border-glass-border bg-bg-tertiary"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Chat
        </Button>
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
            <div key={idx} className={`group flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 overflow-hidden" style={{ border: `1px solid ${ai.color}` }}>
                  {ai.icon}
                </div>
              )}
              <div className={`flex flex-col gap-1 max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`border border-glass-border p-4 whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-accent-active/10 text-text-primary rounded-2xl rounded-tr-sm' 
                    : 'bg-bg-tertiary text-text-primary rounded-2xl rounded-tl-sm'
                }`}>
                  {msg.imageBase64 && (
                    <img src={msg.imageBase64} alt="Uploaded" className="max-w-full rounded-lg mb-3 border border-glass-border" />
                  )}
                  {msg.content}
                </div>
                <button 
                  onClick={() => deleteMessage(idx)}
                  className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-text-muted hover:text-accent-red mt-1 px-1`}
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </button>
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
        <div 
          className={`p-4 border-t border-glass-border flex flex-col gap-3 transition-colors ${
            isDragging ? 'bg-accent-active/10 border-accent-active' : 'bg-bg-tertiary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {imageBase64 && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-glass-border group ml-2">
              <img src={imageBase64} alt="Preview" className="w-full h-full object-cover" />
              <button 
                onClick={() => setImageBase64(null)}
                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="relative flex items-center"
          >
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPaste={handlePaste}
              placeholder={imageBase64 ? "Add a message about this image..." : ai.placeholder} 
              className="pr-12 h-12 rounded-full bg-bg-secondary"
            />
            <Button 
              type="submit"
              disabled={isLoading || (!input.trim() && !imageBase64)}
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
