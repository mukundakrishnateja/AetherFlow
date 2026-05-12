import { QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts } from
"@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            
            Go home
          </Link>
        </div>
      </div>
    </div>);

}

function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            
            Go home
          </a>
        </div>
      </div>
    </div>);

}

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: "Lovable App" },
    { name: "description", content: "Lovable Generated Project" },
    { name: "author", content: "Lovable" },
    { property: "og:title", content: "Lovable App" },
    { property: "og:description", content: "Lovable Generated Project" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:site", content: "@Lovable" }],

    links: [
    {
      rel: "stylesheet",
      href: appCss
    }]

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});

function RootShell({ children }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>);

}

import React from "react";
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.warn("Missing Publishable Key");
}

class ClerkErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
          <div className="max-w-md glass p-8 rounded-3xl border-red-500/20 shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-red-500">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">Authentication Offline</h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We couldn't connect to Clerk's security servers. This is usually caused by a VPN, corporate firewall, or browser extension blocking the connection.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                Error: {this.state.error?.message || "Connection Blocked"}
              </p>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import { AetherProvider } from '@/lib/Store';

import { Toaster } from 'sonner';

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <ClerkErrorBoundary>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <AetherProvider>
          <QueryClientProvider client={queryClient}>
            <Toaster position="top-right" richColors expand={true} />
            <Outlet />
          </QueryClientProvider>
        </AetherProvider>
      </ClerkProvider>
    </ClerkErrorBoundary>
  );
}