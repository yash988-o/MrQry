import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-active/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-ghalib-orange/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="w-full max-w-md h-[500px] animate-pulse bg-bg-secondary rounded-2xl" />}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
