import React, { useState } from "react";
import PasswordInput from "./PasswordInput";

interface EditingStepProps {
  onSave: (password: string, newKey: string) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export default function EditingStep({ onSave, onCancel, isPending }: EditingStepProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [showNewKey, setShowNewKey] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSave(password, newKey);
    setPassword("");
    setNewKey("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-slate-400 text-sm">
        Enter a new Gemini API key. It will be used immediately — no server
        restart needed.
      </p>

      <PasswordInput
        id="edit-password"
        label="Confirm Password"
        value={password}
        onChange={setPassword}
        placeholder="Settings password…"
        visible={showPassword}
        onToggleVisibility={() => setShowPassword((v) => !v)}
      />

      <PasswordInput
        id="new-api-key"
        label="New API Key"
        value={newKey}
        onChange={setNewKey}
        placeholder="AIza…"
        visible={showNewKey}
        onToggleVisibility={() => setShowNewKey((v) => !v)}
        mono
      />

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-all"
        >
          Cancel
        </button>
        <button
          id="save-key-btn"
          type="submit"
          disabled={!password || !newKey.trim() || isPending}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-md shadow-violet-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving…" : "Save Key"}
        </button>
      </div>
    </form>
  );
}
