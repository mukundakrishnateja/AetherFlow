import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import { AetherProvider } from "@/lib/Store";
import Dashboard from "@/components/Dashboard";
import "./styles.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AetherProvider>
        <Toaster position="top-right" richColors expand={true} />
        <AuthWrapper />
      </AetherProvider>
    </ClerkProvider>
  );
}

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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
