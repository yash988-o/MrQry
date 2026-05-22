"use client";

import { motion } from "framer-motion";
import { CheckSquare, Flame, Calendar, Clock, ArrowRight, BrainCircuit } from "lucide-react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CountUp from "@/components/ui/CountUp";

export default function DashboardHome() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Tasks Completed"
            value={<CountUp end={24} duration={1.5} />}
            icon={<CheckSquare className="w-4 h-4 text-accent-violet" />}
            trend={{ value: 12, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Current Streak"
            value={<CountUp end={5} suffix=" Days" duration={1.5} />}
            icon={<Flame className="w-4 h-4 text-ghalib-orange" />}
            trend={{ value: 0, isPositive: true }}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Pending Revisions"
            value={<CountUp end={18} duration={1.5} />}
            icon={<Calendar className="w-4 h-4 text-mukki-cyan" />}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Focus Time"
            value={<CountUp end={14.5} suffix="h" duration={1.5} />}
            icon={<Clock className="w-4 h-4 text-accent-green" />}
            trend={{ value: 5, isPositive: true }}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-text-primary">Today's Focus</h2>
            <Link href="/dashboard/tasks">
              <Button variant="ghost" size="sm" className="text-xs">
                View All <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { id: 1, title: "Study Nervous System Chapter 4", priority: "high", time: "45m", subject: "Biology" },
              { id: 2, title: "Complete Calculus Set 8", priority: "medium", time: "60m", subject: "Math" },
              { id: 3, title: "Review Spanish Vocab", priority: "low", time: "20m", subject: "Language" },
            ].map((task) => (
              <Card key={task.id} className="p-4 hover:border-accent-active transition-colors cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-md border border-glass-border flex items-center justify-center shrink-0 group-hover:border-accent-active" />
                    <div>
                      <h4 className="font-medium text-text-primary mb-1">{task.title}</h4>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-text-muted">{task.time}</span>
                        <span className="text-glass-border">•</span>
                        <span className="text-text-muted">{task.subject}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "default"}>
                    {task.priority}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-text-primary">Up Next</h2>
          </div>
          <Card className="p-0 overflow-hidden">
            <div className="p-5 border-b border-glass-border bg-bg-tertiary/50">
              <h3 className="font-medium text-text-primary">Spaced Repetition</h3>
              <p className="text-xs text-text-secondary mt-1">Due today: 18 items</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-violet/10 text-accent-violet flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Neuroscience Deck</h4>
                    <p className="text-xs text-text-muted">12 cards to review</p>
                  </div>
                </div>
                <Button size="sm">Start</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-ghalib-orange/10 text-ghalib-orange flex items-center justify-center">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-text-primary">Algorithms 101</h4>
                    <p className="text-xs text-text-muted">6 cards to review</p>
                  </div>
                </div>
                <Button size="sm">Start</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
