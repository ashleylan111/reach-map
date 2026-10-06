"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ReachApp } from "@/components/reach-app";
import { useAuth } from "@/lib/auth";

export function AuthGate() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  if (!ready) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f5f5f7] text-sm text-[#6e6e73]">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f5f5f7] text-sm text-[#6e6e73]">
        Redirecting to login…
      </div>
    );
  }

  return <ReachApp />;
}
