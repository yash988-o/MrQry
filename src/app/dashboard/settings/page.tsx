"use client";

import { useAccentColor } from "@/providers/ThemeProvider";
import { useToast } from "@/providers/ToastProvider";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Select from "@/components/ui/Select";
import { Save } from "lucide-react";

const ACCENT_COLORS = [
  { name: "Violet", hex: "#7C6AF7" },
  { name: "Green", hex: "#4ADE80" },
  { name: "Amber", hex: "#FBBF24" },
  { name: "Red", hex: "#F87171" },
  { name: "Cyan", hex: "#22D3EE" },
  { name: "Pink", hex: "#F472B6" },
];

export default function SettingsPage() {
  const { accentColor, setAccentColor } = useAccentColor();
  const { toast } = useToast();

  const handleSave = () => {
    toast({ title: "Settings saved successfully", type: "success" });
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-text-primary mb-1">Settings</h1>
          <p className="text-text-secondary text-sm">Manage your preferences and app experience.</p>
        </div>
        <Button onClick={handleSave} className="gap-2 shrink-0">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="p-8">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-6">Appearance</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">Accent Color</label>
              <div className="flex flex-wrap gap-4">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setAccentColor(color.hex)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${
                      accentColor === color.hex ? "ring-2 ring-white ring-offset-2 ring-offset-bg-secondary" : ""
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {accentColor === color.hex && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-muted mt-3">This updates the primary action color across the app.</p>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-6">Learning Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Default Session Duration</label>
              <Select defaultValue="25">
                <option value="15">15 minutes</option>
                <option value="25">25 minutes (Pomodoro)</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">Spaced Repetition Intensity</label>
              <Select defaultValue="standard">
                <option value="relaxed">Relaxed (Less frequent)</option>
                <option value="standard">Standard (SM-2 Default)</option>
                <option value="aggressive">Aggressive (High retention)</option>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2 border-t border-glass-border pt-6 mt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-text-primary">Strict Mode</h4>
                  <p className="text-xs text-text-muted mt-1">Automatically pause timer if tab loses focus for more than 5 minutes.</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-8">
          <h2 className="text-lg font-display font-semibold text-text-primary mb-6">Profile</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Full Name</label>
                <Input defaultValue="Yash J." />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">Email Address</label>
                <Input defaultValue="yash@example.com" disabled />
              </div>
            </div>
            
            <div className="border-t border-glass-border pt-6 mt-2 flex justify-end">
              <Button variant="danger" className="bg-bg-tertiary text-accent-red border border-accent-red/20 hover:bg-accent-red/10">
                Sign Out
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
