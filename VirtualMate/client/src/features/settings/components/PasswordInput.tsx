import React from "react";
import EyeIcon from "./EyeIcon";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  visible: boolean;
  onToggleVisibility: () => void;
  autoComplete?: string;
  mono?: boolean;
}

/** Reusable password / secret field with show-hide toggle */
export default function PasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder = "",
  visible,
  onToggleVisibility,
  autoComplete,
  mono = false,
}: PasswordInputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs text-slate-400 font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-violet-500/50 transition-all">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`flex-1 bg-transparent text-slate-200 placeholder-slate-600 text-sm outline-none ${mono ? "font-mono" : ""}`}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="text-slate-500 hover:text-slate-300 transition-colors"
          aria-label={visible ? "Hide" : "Show"}
        >
          <EyeIcon visible={visible} />
        </button>
      </div>
    </div>
  );
}
