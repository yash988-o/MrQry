"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Target, Plus, Trophy, Clock, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";

const mockGoals = [
  {
    id: "g1",
    title: "Complete AWS Certification",
    type: "monthly",
    targetMetric: "Modules",
    targetValue: 20,
    currentValue: 12,
    status: "active",
    deadline: "Oct 31, 2026",
  },
  {
    id: "g2",
    title: "Study 2 Hours Daily",
    type: "daily",
    targetMetric: "Hours",
    targetValue: 2,
    currentValue: 1.5,
    status: "active",
    deadline: "Today",
  },
  {
    id: "g3",
    title: "Learn 50 New Spanish Words",
    type: "weekly",
    targetMetric: "Words",
    targetValue: 50,
    currentValue: 50,
    status: "completed",
    deadline: "Oct 26, 2026",
  },
];

export default function GoalsPage() {
  const [goals, setGoals] = useLocalStorage("mrqry_goals", mockGoals);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleAddGoal = () => {
    if (!newTitle.trim()) return;
    setGoals([...goals, {
      id: Date.now().toString(),
      title: newTitle,
      type: "daily",
      targetMetric: "Units",
      targetValue: 10,
      currentValue: 0,
      status: "active",
      deadline: "Ongoing"
    }]);
    setNewTitle("");
    setIsAdding(false);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Goals</h1>
          <p className="text-text-secondary text-sm">Set targets and track your milestones.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4" /> {isAdding ? "Cancel" : "New Goal"}
        </Button>
      </div>

      {isAdding && (
        <Card className="mb-8 p-6 flex flex-col sm:flex-row gap-4 items-center">
          <Input 
            placeholder="Enter goal title (e.g. Read 20 pages)" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
            className="flex-1"
          />
          <Button onClick={handleAddGoal}>Add</Button>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="flex items-center gap-4 p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary">
          <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6 text-accent-violet" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Active Goals</p>
            <p className="text-2xl font-display font-bold text-text-primary">2</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary">
          <div className="w-12 h-12 rounded-full bg-accent-green/10 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6 text-accent-green" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Completed</p>
            <p className="text-2xl font-display font-bold text-text-primary">12</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 p-5 bg-gradient-to-br from-bg-secondary to-bg-tertiary">
          <div className="w-12 h-12 rounded-full bg-accent-amber/10 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-accent-amber" />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">Avg Completion</p>
            <p className="text-2xl font-display font-bold text-text-primary">85%</p>
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-display font-semibold text-text-primary mb-4">Your Objectives</h2>
      
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = (goal.currentValue / goal.targetValue) * 100;
          return (
            <Card key={goal.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary">{goal.title}</h3>
                    <Badge variant={goal.status === "completed" ? "success" : "default"}>
                      {goal.status}
                    </Badge>
                    <Badge variant="core">{goal.type}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> Due: {goal.deadline}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary mb-1">
                        {goal.currentValue} / {goal.targetValue} {goal.targetMetric}
                      </p>
                      <p className="text-xs text-text-muted">{Math.round(progress)}% Complete</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-text-muted hover:text-accent-red transition-all rounded-lg hover:bg-bg-tertiary shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <ProgressBar 
                progress={progress} 
                colorClass={goal.status === "completed" ? "bg-accent-green" : "bg-accent-active"} 
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
