import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg-primary text-accent-active">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}
