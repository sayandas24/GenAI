import React from "react";
import type { Step } from "../pages/SettingsPage";
import FeedbackBanner from "./FeedbackBanner";
import LockedStep from "./LockedStep";
import RevealedStep from "./RevealedStep";
import EditingStep from "./EditingStep";

interface ApiKeyCardProps {
  step: Step;
  currentKey: string;
  errorMsg: string;
  successMsg: string;
  isRevealPending: boolean;
  isUpdatePending: boolean;
  onReveal: (password: string) => Promise<void>;
  onCopy: () => void;
  onEdit: () => void;
  onSave: (password: string, newKey: string) => Promise<void>;
  onCancelEdit: () => void;
  onLock: () => void;
}

export default function ApiKeyCard({
  step,
  currentKey,
  errorMsg,
  successMsg,
  isRevealPending,
  isUpdatePending,
  onReveal,
  onCopy,
  onEdit,
  onSave,
  onCancelEdit,
  onLock,
}: ApiKeyCardProps) {
  return (
    <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-amber-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-medium">Gemini API Key</p>
            <p className="text-slate-500 text-xs">
              Used by the AI agent to generate responses
            </p>
          </div>
        </div>

        {step !== "locked" && (
          <button
            onClick={onLock}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Lock
          </button>
        )}
      </div>

      {/* Card body */}
      <div className="px-6 py-5">
        <FeedbackBanner error={errorMsg} success={successMsg} />

        {step === "locked" && (
          <LockedStep onReveal={onReveal} isPending={isRevealPending} />
        )}
        {step === "revealed" && (
          <RevealedStep currentKey={currentKey} onCopy={onCopy} onEdit={onEdit} />
        )}
        {step === "editing" && (
          <EditingStep onSave={onSave} onCancel={onCancelEdit} isPending={isUpdatePending} />
        )}
      </div>
    </section>
  );
}
