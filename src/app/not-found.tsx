import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-primary">
      <h2 className="text-4xl font-display font-bold text-accent-active mb-4">404</h2>
      <p className="text-text-secondary mb-8">This page could not be found.</p>
      <Link 
        href="/"
        className="px-6 py-2 bg-accent-active text-white rounded-full hover:bg-opacity-90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
