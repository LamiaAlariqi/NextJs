"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginButton() {
  const sessionContext = useSession();
  const session = sessionContext?.data;

  if (session) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 border border-border rounded-xl glass max-w-sm mx-auto">
        <p className="text-sm font-medium text-foreground">
          Signed in as <span className="text-primary font-semibold">{session.user.email}</span>
        </p>
        <button
          onClick={() => signOut()}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-4 border border-border rounded-xl glass max-w-sm mx-auto">
      <p className="text-sm text-muted-foreground">Not signed in</p>
      <button
        onClick={() => signIn()}
        className="bg-primary hover:opacity-90 text-primary-foreground font-semibold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
      >
        Sign In
      </button>
    </div>
  );
}
