"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthButtons() {
  return (
    <>
      <Show when="signed-out" fallback={<UserButton />}>
        <SignInButton>
          <button className="rounded-full border border-black/[.08] dark:border-white/[.15] px-4 py-1.5 text-sm font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06]">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-sm font-medium text-white dark:text-zinc-900 transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-200">
            Sign up
          </button>
        </SignUpButton>
      </Show>
    </>
  );
}
