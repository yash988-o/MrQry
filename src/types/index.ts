export type Priority = "low" | "medium" | "high" | "core";
export type LearningType = "academic" | "creative" | "technical" | "personal" | "other";
export type WorthLearning = "yes" | "no" | "maybe";
export type ConfidenceScore = "struggled" | "partial" | "understood" | "nailed";
export type GoalType = "daily" | "weekly" | "monthly";
export type GoalStatus = "active" | "completed" | "missed";
export type SpacedRepSchedule = "standard" | "aggressive" | "relaxed";
export type GrowthCompanion = "plant" | "character" | "planet" | "building";
export type CalcMode = "basic" | "scientific" | "graphing" | "converter";
export type AngleMode = "deg" | "rad";

export interface Task {
  id: string;
  title: string;
  learningType: LearningType;
  worthLearning: WorthLearning;
  priority: Priority;
  estimatedMinutes?: number;
  completed: boolean;
  confidenceScore?: ConfidenceScore;
  addedToSpacedRep: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetMetric?: string;
  targetValue: number;
  currentValue: number;
  status: GoalStatus;
  deadline: string;
  createdAt: string;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  subjectIcon: string;
  cards: Flashcard[];
  lastReviewedAt?: string;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string;
  back: string;
  confidenceScore?: ConfidenceScore;
  reviewCount: number;
  lastReviewedAt?: string;
}

export interface SpacedRepetitionEntry {
  id: string;
  taskId: string;
  subject: string;
  subjectIcon: string;
  originalDate: string;
  scheduledDate: string;
  revisionNumber: number;
  totalRevisions: number;
  lastConfidence?: ConfidenceScore;
  completed: boolean;
  missed: boolean;
}

export interface TimerSession {
  id: string;
  topic: string;
  durationMinutes: number;
  breakIntervalMinutes: number;
  numBreaks?: number;
  growthCompanion: GrowthCompanion;
  idleGracePeriodSeconds: number;
  startedAt: string;
  endedAt?: string;
  elapsedSeconds: number;
  isActive: boolean;
  isPaused: boolean;
}

export interface ProgressReport {
  totalStudyHoursMonth: number;
  tasksCompletedMonth: number;
  goalsAchievedMonth: number;
  revisionCompliancePercent: number;
  studyTimeByDay: { date: string; hours: number }[];
  timePerSubject: { subject: string; hours: number; color: string }[];
  goalCompletionByWeek: { week: string; completed: number; missed: number }[];
  activityHeatmap: { date: string; intensity: number }[];
  aiSummary: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  accentColor: string;
  spacedRepSchedule: SpacedRepSchedule;
  defaultSessionMinutes: number;
  defaultBreakMinutes: number;
  idleGracePeriodSeconds: number;
  geminiApiKey?: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  taskReminders: boolean;
  spacedRepetition: boolean;
  goals: boolean;
  breakReminders: boolean;
  eyeStrain: boolean;
  weeklyReport: boolean;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
  rating: number;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
