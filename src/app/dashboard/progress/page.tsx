"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { Sparkles, TrendingUp, Clock, BrainCircuit } from "lucide-react";
import Card from "@/components/ui/Card";
import StatCard from "@/components/dashboard/StatCard";

const weeklyData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 3.8 },
  { name: 'Wed', hours: 1.5 },
  { name: 'Thu', hours: 4.2 },
  { name: 'Fri', hours: 3.0 },
  { name: 'Sat', hours: 5.5 },
  { name: 'Sun', hours: 4.0 },
];

const subjectData = [
  { name: 'Math', value: 45, color: 'var(--accent-violet)' },
  { name: 'Physics', value: 25, color: 'var(--accent-green)' },
  { name: 'Spanish', value: 20, color: 'var(--ghalib-orange)' },
  { name: 'CS', value: 10, color: 'var(--mukki-cyan)' },
];

export default function ProgressDashboard() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Progress Analytics</h1>
          <p className="text-text-secondary text-sm">Insights into your learning journey.</p>
        </div>
      </div>

      {/* AI Summary Banner */}
      <Card className="bg-gradient-to-r from-bg-secondary to-accent-active/5 border-accent-active/20 flex items-start gap-4 p-6">
        <div className="w-12 h-12 rounded-xl bg-accent-active/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-accent-active" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">AI Insights</h3>
          <p className="text-text-secondary leading-relaxed text-sm">
            You're on a 5-day streak! Your most productive day this week was Saturday. 
            You might want to dedicate more time to CS based on your upcoming goals. 
            Keep up the excellent retention rate in Spanish (92%).
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Study Hours"
          value="24.5h"
          icon={<Clock className="w-5 h-5 text-accent-violet" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Avg. Retention Rate"
          value="88%"
          icon={<BrainCircuit className="w-5 h-5 text-accent-green" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Productivity Score"
          value="92"
          icon={<TrendingUp className="w-5 h-5 text-accent-amber" />}
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Study Time (This Week)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-active)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-active)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--glass-border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                  itemStyle={{ color: 'var(--accent-active)' }}
                />
                <Area type="monotone" dataKey="hours" stroke="var(--accent-active)" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-6">Time by Subject</h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--glass-border)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 13 }} width={80} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                  {subjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
