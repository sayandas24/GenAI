import React from "react";

interface FeedbackBannerProps {
  error?: string;
  success?: string;
}

/** Renders error and/or success banners — renders nothing if both are empty */
export default function FeedbackBanner({ error, success }: FeedbackBannerProps) {
  if (!error && !success) return null;

  return (
    <>
      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
          {success}
        </div>
      )}
    </>
  );
}
