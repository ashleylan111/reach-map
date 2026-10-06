"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/lib/auth";

export default function Page() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) {
      router.replace("/");
    }
  }, [ready, user, router]);

  if (!ready || user) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center bg-[#f5f5f7] p-6 text-sm text-[#6e6e73] md:p-10">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-[#f5f5f7] p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
