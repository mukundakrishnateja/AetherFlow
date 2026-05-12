import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "@/components/Dashboard";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";

function AuthWrapper() {
  return (
    <>
      <SignedIn>
        <Dashboard />
      </SignedIn>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-aurora)", filter: "blur(60px)" }} />
          <div className="relative z-10 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--gradient-primary)" }}>
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <h1 className="text-2xl font-bold gradient-text">AetherFlow OS</h1>
              <p className="text-sm text-muted-foreground mt-2">Sign in to sync your productivity workspace.</p>
            </div>
            <SignIn />
          </div>
        </div>
      </SignedOut>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: AuthWrapper,
  head: () => ({
    meta: [
    { title: "AetherFlow — Your Productivity OS" },
    { name: "description", content: "AetherFlow is a futuristic productivity dashboard for tasks, focus, goals and notes." }]
  })
});