"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Plus, Filter } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Tabs from "@/components/ui/Tabs";
import { mockTasks } from "@/data/mockTasks";
import TaskItem from "@/components/dashboard/TaskItem";

export default function TasksPage() {
  const [tasks, setTasks] = useLocalStorage("mrqry_tasks", mockTasks);
  const [activeTab, setActiveTab] = useState("all");

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === "pending") return !task.completed;
    if (activeTab === "completed") return task.completed;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Your Tasks</h1>
          <p className="text-text-secondary text-sm">Manage your learning objectives.</p>
        </div>
        <Button className="shrink-0 gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Tabs
          tabs={[
            { id: "all", label: "All Tasks" },
            { id: "pending", label: "Pending" },
            { id: "completed", label: "Completed" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
        />
        <div className="flex-1" />
        <div className="w-full sm:w-64 flex gap-2">
          <Input placeholder="Search tasks..." className="h-10" />
          <Button variant="secondary" className="px-3 shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-12">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-text-muted border border-dashed border-glass-border rounded-xl">
            <p>No tasks found in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
}
