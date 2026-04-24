import React, { useState } from "react";
import { useGetApiKey, useUpdateApiKey } from "../hooks/useApiKeySettings";
import { extractErrorMessage } from "../services/settings.api";
import ApiKeyCard from "../components/ApiKeyCard";

export type Step = "locked" | "revealed" | "editing";

export default function SettingsPage() {
  const [step, setStep] = useState<Step>("locked");
  const [currentKey, setCurrentKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const getKey = useGetApiKey();
  const updateKey = useUpdateApiKey();

  function clearMessages() {
    setErrorMsg("");
    setSuccessMsg("");
  }

  async function handleReveal(password: string) {
    clearMessages();
    try {
      const data = await getKey.mutateAsync({ password });
      setCurrentKey(data.geminiApiKey);
      setStep("revealed");
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, "Failed to fetch API key"));
    }
  }

  async function handleSave(password: string, newKey: string) {
    clearMessages();
    try {
      await updateKey.mutateAsync({ password, geminiApiKey: newKey });
      setSuccessMsg("API key updated successfully! Changes take effect immediately.");
      setStep("locked");
      setCurrentKey("");
    } catch (err) {
      setErrorMsg(extractErrorMessage(err, "Failed to update API key"));
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(currentKey);
    setSuccessMsg("Copied to clipboard!");
    setTimeout(() => setSuccessMsg(""), 2000);
  }

  function handleLock() {
    setStep("locked");
    setCurrentKey("");
    clearMessages();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-200">
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/5 bg-slate-900/60 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">Settings</h1>
            <p className="text-slate-400 text-xs">Manage VirtualMate configuration</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <ApiKeyCard
          step={step}
          currentKey={currentKey}
          errorMsg={errorMsg}
          successMsg={successMsg}
          isRevealPending={getKey.isPending}
          isUpdatePending={updateKey.isPending}
          onReveal={handleReveal}
          onCopy={handleCopy}
          onEdit={() => { setStep("editing"); clearMessages(); }}
          onSave={handleSave}
          onCancelEdit={() => { setStep("revealed"); clearMessages(); }}
          onLock={handleLock}
        />
      </main>
    </div>
  );
}
