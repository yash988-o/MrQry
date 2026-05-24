"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, BrainCircuit } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock data generator for month-aware revisions
const getMockRevisions = (year: number, month: number): Record<string, { count: number; subjects: string[] }> => ({
  [`${year}-${month}-12`]: { count: 3, subjects: ["Math", "Physics"] },
  [`${year}-${month}-15`]: { count: 1, subjects: ["Spanish"] },
  [`${year}-${month}-18`]: { count: 5, subjects: ["History", "Biology"] },
  [`${year}-${month}-22`]: { count: 2, subjects: ["CS"] },
  [`${year}-${month}-25`]: { count: 4, subjects: ["Math", "Literature"] },
});

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [notesDict, setNotesDict] = useState<Record<string, string>>({});
  const [personalNotes, setPersonalNotes] = useState("");
  const [isNotesLoaded, setIsNotesLoaded] = useState(false);

  const selectedDateKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${selectedDate}`;

  useEffect(() => {
    const saved = localStorage.getItem("mrqry_personal_notes_v2");
    if (saved) {
      try {
        setNotesDict(JSON.parse(saved));
      } catch (e) {}
    }
    setIsNotesLoaded(true);
  }, []);

  useEffect(() => {
    if (isNotesLoaded) {
      setPersonalNotes(notesDict[selectedDateKey] || "");
    }
  }, [selectedDateKey, isNotesLoaded]);

  const handleSaveNote = () => {
    const newDict = { ...notesDict, [selectedDateKey]: personalNotes };
    setNotesDict(newDict);
    localStorage.setItem("mrqry_personal_notes_v2", JSON.stringify(newDict));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  
  const currentMockRevisions = getMockRevisions(currentMonth.getFullYear(), currentMonth.getMonth() + 1);

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Spaced Repetition</h1>
          <p className="text-text-secondary text-sm">Your scientifically optimized review schedule.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-medium text-text-primary">
                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={prevMonth} className="px-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="secondary" size="sm" onClick={nextMonth} className="px-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-text-muted pb-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {padding.map(i => (
                <div key={`pad-${i}`} className="h-24 rounded-xl bg-transparent" />
              ))}
              {days.map(day => {
                const dateKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}-${day}`;
                const revision = currentMockRevisions[dateKey];
                const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 rounded-xl border p-2 flex flex-col items-start transition-colors w-full text-left ${
                      day === selectedDate 
                        ? 'border-accent-active bg-accent-active/10 shadow-shadow-glow-violet' 
                        : isToday 
                          ? 'border-accent-active/50 bg-accent-active/5' 
                          : 'border-glass-border bg-bg-tertiary hover:border-text-muted'
                    }`}
                  >
                    <span className={`text-sm font-medium ${day === selectedDate || isToday ? 'text-accent-active' : 'text-text-secondary'}`}>
                      {day}
                    </span>
                    {revision && (
                      <div className="mt-auto flex flex-col gap-1">
                        <div className="flex -space-x-1">
                          {revision.subjects.map((sub, idx) => (
                            <div key={idx} className="w-4 h-4 rounded-full bg-accent-violet border border-bg-tertiary" title={sub} />
                          ))}
                        </div>
                        <span className="text-[10px] text-text-muted font-medium">{revision.count} items</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-accent-active/5 border-accent-active/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-active/20 flex items-center justify-center shrink-0">
                <BrainCircuit className="w-5 h-5 text-accent-active" />
              </div>
              <div>
                <h3 className="font-medium text-text-primary mb-1">How it works</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  When you complete a task and add it to Spaced Repetition, Mercury schedules reviews at optimal intervals (1, 3, 7, 14 days) based on your confidence score to interrupt the forgetting curve.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium text-text-primary mb-4">
              Reviews for {currentMonth.toLocaleString('default', { month: 'short' })} {selectedDate}
            </h3>
            <div className="space-y-4">
              {currentMockRevisions[selectedDateKey] ? (
                currentMockRevisions[selectedDateKey].subjects.map((sub, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{sub}</p>
                    </div>
                    <Badge variant="default">Due</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-muted">No reviews scheduled for this day. You are free!</p>
              )}
            </div>
          </Card>

          <Card className="p-6 border-glass-border">
            <h3 className="font-medium text-text-primary mb-3">Notes for {currentMonth.toLocaleString('default', { month: 'short' })} {selectedDate}</h3>
            <div className="flex flex-col gap-3">
              <textarea
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="Jot down important dates, thoughts, or custom reminders here..."
                className="w-full h-32 bg-bg-tertiary border border-glass-border rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:border-accent-violet transition-colors resize-none placeholder:text-text-muted/50"
              />
              <div className="flex justify-end">
                <Button onClick={handleSaveNote} size="sm">
                  Save Note
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
