import React from "react";

interface RevealedStepProps {
  currentKey: string;
  onCopy: () => void;
  onEdit: () => void;
}

export default function RevealedStep({ currentKey, onCopy, onEdit }: RevealedStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-slate-400 font-medium">
          Current API Key
        </label>
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-sm text-slate-300 break-all select-all">
          {currentKey}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCopy}
          className="flex-1 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm transition-all"
        >
          Copy
        </button>
        <button
          id="edit-key-btn"
          onClick={onEdit}
          className="flex-1 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-md shadow-violet-500/20"
        >
          Change Key
        </button>
      </div>
    </div>
  );
}
