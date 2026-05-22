"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BrainCircuit } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

// Mock data for revisions
const mockRevisions: Record<number, { count: number; subjects: string[] }> = {
  12: { count: 3, subjects: ["Math", "Physics"] },
  15: { count: 1, subjects: ["Spanish"] },
  18: { count: 5, subjects: ["History", "Biology"] },
  22: { count: 2, subjects: ["CS"] },
  25: { count: 4, subjects: ["Math", "Literature"] },
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

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
                const revision = mockRevisions[day];
                const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth();

                return (
                  <div
                    key={day}
                    className={`h-24 rounded-xl border p-2 flex flex-col transition-colors ${
                      isToday ? 'border-accent-active bg-accent-active/5' : 'border-glass-border bg-bg-tertiary hover:border-text-muted'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-accent-active' : 'text-text-secondary'}`}>
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
                  </div>
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
            <h3 className="font-medium text-text-primary mb-4">Upcoming Reviews</h3>
            <div className="space-y-4">
              {[
                { date: "Tomorrow", subject: "Math", items: 3 },
                { date: "Oct 25", subject: "Spanish", items: 12 },
                { date: "Oct 28", subject: "History", items: 8 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.subject}</p>
                    <p className="text-xs text-text-muted">{item.date}</p>
                  </div>
                  <Badge variant="default">{item.items} items</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
