import React, { useState } from "react";
import PasswordInput from "./PasswordInput";

interface LockedStepProps {
  onReveal: (password: string) => Promise<void>;
  isPending: boolean;
}

export default function LockedStep({ onReveal, isPending }: LockedStepProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onReveal(password);
    setPassword("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-slate-400 text-sm">
        Enter your settings password to view or change the API key.
      </p>

      <PasswordInput
        id="settings-password"
        label="Settings Password"
        value={password}
        onChange={setPassword}
        placeholder="Enter password…"
        visible={showPassword}
        onToggleVisibility={() => setShowPassword((v) => !v)}
        autoComplete="current-password"
      />

      <button
        id="reveal-key-btn"
        type="submit"
        disabled={!password || isPending}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-md shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isPending ? "Verifying…" : "Unlock & View Key"}
      </button>
    </form>
  );
}
