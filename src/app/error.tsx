"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary">
      <h2 className="text-2xl font-display font-bold text-accent-red mb-4">Something went wrong!</h2>
      <button
        className="px-6 py-2 bg-bg-secondary border border-glass-border rounded-full hover:bg-bg-tertiary transition-colors"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
