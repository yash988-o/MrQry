"use client";

import { use, useState, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Heart, Send, Trash2, X, Plus, MessageSquare } from "lucide-react";
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

type Message = { role: 'user' | 'model'; content: string; imageBase64?: string };
type Session = { id: string; title: string; messages: Message[]; updatedAt: number };

export default function CompanionPage({ params }: { params: Promise<{ companion: string }> }) {
  const resolvedParams = use(params);
  const companionKey = resolvedParams.companion.toLowerCase() as CompanionKey;
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [input, setInput] = useState('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storageKey = `mrqry_sessions_${companionKey}`;
    const oldStorageKey = `mrqry_chat_${companionKey}`;
    
    const savedSessions = localStorage.getItem(storageKey);
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
        } else {
          createNewSession();
        }
      } catch (e) {
        createNewSession();
      }
    } else {
      // Migrate old data if exists
      const oldSaved = localStorage.getItem(oldStorageKey);
      if (oldSaved) {
        try {
          const oldMessages = JSON.parse(oldSaved);
          if (oldMessages.length > 0) {
            const migratedSession: Session = {
              id: Date.now().toString(),
              title: "Legacy Chat",
              messages: oldMessages,
              updatedAt: Date.now()
            };
            setSessions([migratedSession]);
            setActiveSessionId(migratedSession.id);
          } else {
            createNewSession();
          }
        } catch(e) {
          createNewSession();
        }
      } else {
        createNewSession();
      }
    }
    setIsInitialized(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companionKey]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(`mrqry_sessions_${companionKey}`, JSON.stringify(sessions));
    }
  }, [sessions, isInitialized, companionKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSessionId, isLoading]);

  if (!COMPANIONS[companionKey]) {
    notFound();
  }

  const ai = COMPANIONS[companionKey];
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const createNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      updatedAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

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

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  
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

  const deleteMessage = (msgIndex: number) => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: s.messages.filter((_, i) => i !== msgIndex) };
      }
      return s;
    }));
  };

  const confirmDeleteSession = () => {
    if (!sessionToDelete) return;
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionToDelete);
      if (filtered.length === 0) {
        const newSession: Session = { id: Date.now().toString(), title: "New Conversation", messages: [], updatedAt: Date.now() };
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (activeSessionId === sessionToDelete) {
        setActiveSessionId(filtered[0].id);
      }
      return filtered;
    });
    setSessionToDelete(null);
  };

  const sendMessage = async () => {
    if ((!input.trim() && !imageBase64) || isLoading || !activeSessionId) return;
    const userMsg = input.trim();
    const currentImage = imageBase64;
    
    setInput("");
    setImageBase64(null);
    
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length === 0 && userMsg ? (userMsg.length > 25 ? userMsg.substring(0, 25) + '...' : userMsg) : s.title;
        return { 
          ...s, 
          title: newTitle,
          messages: [...s.messages, { role: 'user', content: userMsg, imageBase64: currentImage || undefined }],
          updatedAt: Date.now()
        };
      }
      return s;
    }));
    
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
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { 
            ...s, 
            messages: [...s.messages, { role: 'model', content: data.response || `Error: ${data.error}` }],
            updatedAt: Date.now()
          };
        }
        return s;
      }));
    } catch (error) {
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { 
            ...s, 
            messages: [...s.messages, { role: 'model', content: "Sorry, I couldn't connect to my brain right now." }],
            updatedAt: Date.now()
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 sm:-m-8">
      {/* Main Chat Area (Full Screen minus sidebars) */}
      <div className="flex-1 flex flex-col min-w-0 bg-bg-primary">
        {/* Chat Header */}
        <div className="h-16 flex items-center px-6 border-b border-glass-border bg-bg-primary/80 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${ai.color}20`, color: ai.color }}>
              <Brain className="w-4 h-4" />
            </div>
            <h2 className="font-medium text-text-primary">{ai.name}</h2>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* AI Greeting Message */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-bg-tertiary flex items-center justify-center shrink-0 overflow-hidden" style={{ border: `1px solid ${ai.color}` }}>
                {ai.icon}
              </div>
              <div className="bg-bg-tertiary border border-glass-border rounded-2xl rounded-tl-sm p-4 text-text-primary max-w-[80%] shadow-sm">
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
                <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`border border-glass-border p-4 whitespace-pre-wrap shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-accent-active/10 text-text-primary rounded-2xl rounded-tr-sm' 
                      : 'bg-bg-tertiary text-text-primary rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.imageBase64 && (
                      <img src={msg.imageBase64} alt="Uploaded" className="max-w-full rounded-lg mb-3 border border-glass-border shadow-sm" />
                    )}
                    {msg.content}
                  </div>
                  <button 
                    onClick={() => deleteMessage(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-xs text-text-muted hover:text-accent-red mt-1 px-1"
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
                <div className="bg-bg-tertiary border border-glass-border rounded-2xl rounded-tl-sm p-4 text-text-muted max-w-[80%] flex items-center gap-1 shadow-sm">
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                  <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-bg-primary via-bg-primary to-transparent shrink-0">
          <div className="max-w-3xl mx-auto">
            <div 
              className={`relative flex flex-col gap-3 rounded-2xl border transition-all shadow-shadow-card ${
                isDragging ? 'bg-accent-active/10 border-accent-active' : 'bg-bg-tertiary border-glass-border focus-within:border-accent-active/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {imageBase64 && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-glass-border group ml-4 mt-4 shrink-0">
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
                className="relative flex items-center p-2"
              >
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={imageBase64 ? "Add a message about this image..." : ai.placeholder} 
                  className="flex-1 bg-transparent border-none focus:outline-none text-text-primary px-4 py-2 placeholder:text-text-muted"
                />
                <Button 
                  type="submit"
                  disabled={isLoading || (!input.trim() && !imageBase64)}
                  size="sm" 
                  className="shrink-0 w-10 h-10 p-0 rounded-xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Chat History */}
      <div className="w-72 bg-bg-secondary border-l border-glass-border flex flex-col shrink-0">
        <div className="p-4 border-b border-glass-border">
          <Button onClick={createNewSession} className="w-full justify-start gap-2 h-10" variant="secondary">
            <Plus className="w-4 h-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
          {sessions.map(s => (
            <div 
              key={s.id} 
              onClick={() => setActiveSessionId(s.id)}
              className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                activeSessionId === s.id ? 'bg-bg-tertiary border border-glass-border shadow-sm' : 'hover:bg-bg-tertiary/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className={`w-4 h-4 shrink-0 ${activeSessionId === s.id ? 'text-accent-active' : 'text-text-muted'}`} />
                <span className={`text-sm truncate ${activeSessionId === s.id ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                  {s.title}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setSessionToDelete(s.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-accent-red hover:bg-accent-red/10 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {sessionToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-bg-secondary border border-glass-border rounded-2xl shadow-shadow-glow-violet w-full max-w-sm p-6 flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-accent-red/10 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6 text-accent-red" />
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-2">Delete Conversation?</h3>
              <p className="text-sm text-text-secondary mb-6">
                Are you sure you want to delete this chat? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 w-full">
                <Button variant="ghost" onClick={() => setSessionToDelete(null)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="danger" onClick={confirmDeleteSession} className="flex-1">
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
