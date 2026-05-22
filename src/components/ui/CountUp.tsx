"use client";

import { useCountUp } from "@/hooks/useCountUp";
import { cn } from "@/lib/utils";

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({ end, duration = 2, prefix = "", suffix = "", className }: CountUpProps) {
  const { count, ref } = useCountUp(end, duration);

  return (
    <span ref={ref} className={cn("font-display tabular-nums", className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
