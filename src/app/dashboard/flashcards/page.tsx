"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Plus, Sparkles, Play, MoreVertical, Edit2, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

type Flashcard = { id: string; front: string; back: string };
type Deck = { id: string; title: string; color: string; cards: Flashcard[] };

const initialDecks: Deck[] = [
  { 
    id: "d1", title: "Neuroscience 101", color: "bg-accent-violet", 
    cards: [
      { id: "c1", front: "What is the role of the amygdala?", back: "Processing emotions and memories associated with fear and pleasure." },
      { id: "c2", front: "What is neuroplasticity?", back: "The brain's ability to reorganize itself by forming new neural connections." },
      { id: "c3", front: "Function of the hippocampus?", back: "Crucial for learning and memory, especially spatial memory and navigation." }
    ] 
  },
  { 
    id: "d2", title: "Spanish Vocab", color: "bg-accent-green", 
    cards: [
      { id: "c4", front: "Desarrollo", back: "Development" },
      { id: "c5", front: "Lograr", back: "To achieve" }
    ] 
  },
  { id: "d3", title: "Algorithms & DS", color: "bg-ghalib-orange", cards: [] },
  { id: "d4", title: "Historical Dates", color: "bg-mukki-cyan", cards: [] },
];

export default function FlashcardsPage() {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);
  const [view, setView] = useState<"list" | "study" | "edit">("list");
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  
  // Study State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Edit State
  const [newFront, setNewFront] = useState("");
  const [newBack, setNewBack] = useState("");

  const activeDeck = decks.find(d => d.id === activeDeckId);

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      title: "New Custom Deck",
      color: "bg-text-primary",
      cards: []
    };
    setDecks([newDeck, ...decks]);
    setActiveDeckId(newDeck.id);
    setView("edit");
  };

  const handleAddCard = () => {
    if (!newFront || !newBack || !activeDeckId) return;
    setDecks(decks.map(d => {
      if (d.id === activeDeckId) {
        return { ...d, cards: [...d.cards, { id: Date.now().toString(), front: newFront, back: newBack }] };
      }
      return d;
    }));
    setNewFront("");
    setNewBack("");
  };

  const handleDeleteCard = (cardId: string) => {
    setDecks(decks.map(d => {
      if (d.id === activeDeckId) {
        return { ...d, cards: d.cards.filter(c => c.id !== cardId) };
      }
      return d;
    }));
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (activeDeck && cardIndex < activeDeck.cards.length - 1) {
        setCardIndex(cardIndex + 1);
      } else {
        setView("list");
        setCardIndex(0);
      }
    }, 300);
  };

  // --- STUDY VIEW ---
  if (view === "study" && activeDeck) {
    if (activeDeck.cards.length === 0) {
      return (
        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">This deck is empty!</h2>
          <Button onClick={() => setView("edit")}>Add Cards</Button>
        </div>
      );
    }

    const currentCard = activeDeck.cards[cardIndex];

    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center pt-10 pb-20">
        <div className="w-full flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => { setView("list"); setIsFlipped(false); setCardIndex(0); }}>
            ← Back to Decks
          </Button>
          <div className="text-center">
            <h2 className="text-xl font-display font-semibold text-text-primary">{activeDeck.title}</h2>
            <p className="text-sm text-text-secondary">Card {cardIndex + 1} of {activeDeck.cards.length}</p>
          </div>
          <div className="w-24 flex justify-end">
            <Button variant="ghost" className="p-2" onClick={() => setView("edit")}>
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="relative w-full max-w-2xl aspect-[3/2] perspective-[1000px] mb-12">
          <motion.div
            className="w-full h-full relative preserve-3d cursor-pointer"
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Front */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-bg-secondary border border-glass-border rounded-3xl shadow-shadow-card flex flex-col items-center justify-center p-12 text-center">
              <span className="text-3xl font-medium text-text-primary">{currentCard.front}</span>
              <p className="text-sm text-text-muted mt-8 absolute bottom-6">Click to flip</p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 backface-hidden w-full h-full bg-bg-secondary border border-accent-active rounded-3xl shadow-shadow-glow-violet flex flex-col items-center justify-center p-12 text-center [transform:rotateX(180deg)]">
              <span className="text-xl leading-relaxed text-text-primary">
                {currentCard.back}
              </span>
            </div>
          </motion.div>
        </div>

        <div className="h-12 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            {isFlipped ? (
              <motion.div
                key="buttons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-4"
              >
                <Button variant="danger" onClick={nextCard}>Struggled</Button>
                <Button variant="secondary" onClick={nextCard}>Partial</Button>
                <Button className="bg-accent-green hover:brightness-110" onClick={nextCard}>Nailed It</Button>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-text-muted text-sm"
              >
                Recall the answer, then click the card
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // --- EDIT VIEW ---
  if (view === "edit" && activeDeck) {
    return (
      <div className="max-w-4xl mx-auto h-full flex flex-col pt-8 pb-12">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => setView("list")}>← Back</Button>
          <input 
            type="text" 
            value={activeDeck.title} 
            onChange={(e) => setDecks(decks.map(d => d.id === activeDeckId ? { ...d, title: e.target.value } : d))}
            className="text-2xl font-display font-bold bg-transparent border-none outline-none text-text-primary w-full focus:ring-0"
          />
        </div>

        <Card className="mb-8 p-6 flex gap-4 flex-col sm:flex-row">
          <div className="flex-1 space-y-4">
            <Input 
              placeholder="Front (Question)" 
              value={newFront} 
              onChange={e => setNewFront(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
            />
            <Input 
              placeholder="Back (Answer)" 
              value={newBack} 
              onChange={e => setNewBack(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
            />
          </div>
          <Button className="h-auto w-full sm:w-24 shrink-0" onClick={handleAddCard}>Add</Button>
        </Card>

        <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
          {activeDeck.cards.length === 0 ? (
            <div className="text-center text-text-muted py-12 border border-dashed border-glass-border rounded-xl">
              No cards yet. Create your first flashcard above!
            </div>
          ) : (
            activeDeck.cards.map(card => (
              <Card key={card.id} className="p-4 flex items-start justify-between group">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 pr-4">
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Front</span>
                    <p className="text-text-primary mt-1">{card.front}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted uppercase tracking-widest font-bold">Back</span>
                    <p className="text-text-secondary mt-1">{card.back}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCard(card.id)}
                  className="p-2 text-text-muted hover:text-accent-red opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-accent-red/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Flashcards</h1>
          <p className="text-text-secondary text-sm">Create decks, add custom cards, and review.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2 border-accent-active/50 text-accent-active hover:bg-accent-active/10">
            <Sparkles className="w-4 h-4" /> AI Generate
          </Button>
          <Button className="gap-2" onClick={handleCreateDeck}>
            <Plus className="w-4 h-4" /> New Deck
          </Button>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <Input placeholder="Search decks..." className="max-w-md" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <Card key={deck.id} className="flex flex-col group transition-all hover:border-accent-active cursor-pointer" onClick={() => { setActiveDeckId(deck.id); setView("study"); setCardIndex(0); setIsFlipped(false); }}>
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${deck.color}/10`}>
                <BrainCircuit className={`w-6 h-6 ${deck.color.replace('bg-', 'text-')}`} />
              </div>
              <button 
                className="p-2 text-text-muted hover:text-text-primary transition-colors z-10" 
                onClick={(e) => { e.stopPropagation(); setActiveDeckId(deck.id); setView("edit"); }}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-xl font-semibold text-text-primary mb-1">{deck.title}</h3>
            <div className="flex items-center gap-4 text-sm text-text-secondary mb-6">
              <span>{deck.cards.length} cards</span>
              <span>•</span>
              <span>Ready to study</span>
            </div>

            <div className="mt-auto pt-4 border-t border-glass-border flex justify-end">
              <Button size="sm" variant="ghost" className="gap-2 text-text-primary group-hover:text-accent-active group-hover:bg-accent-active/10">
                Study Now <Play className="w-3.5 h-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
