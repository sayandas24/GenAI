import React from "react";
import { Menu, PenSquare } from "lucide-react";

/**
 * Top header for the mobile avatar list screen.
 * Mirrors Telegram's mobile header: hamburger | title | compose.
 */
export default function MobileHeader() {
  return (
    <div className="h-[56px] shrink-0 bg-[#17212b] border-b border-[#0e1621] flex items-center px-2 gap-1">
      <button className="p-2 text-[#7f91a4] hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0">
        <Menu size={22} />
      </button>

      <h1 className="flex-1 text-white font-semibold text-[18px] pl-1 truncate">
        VirtualMate
      </h1>

      <button className="p-2 text-[#7f91a4] hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0">
        <PenSquare size={20} />
      </button>
    </div>
  );
}
