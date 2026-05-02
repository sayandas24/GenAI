import React from "react";
import { Search, MoreVertical } from "lucide-react";

interface Avatar {
  _id: string;
  name: string;
  avatar_url: string;
  description?: string;
}

interface ChatHeaderProps {
  avatar?: Avatar;
}

export default function ChatHeader({ avatar }: ChatHeaderProps) {
  return (
    <div className="h-[56px] shrink-0 bg-[#17212b] border-b border-[#0e1621] flex items-center px-4 gap-3">
      {/* Avatar */}
      <div className="relative shrink-0">
        <img
          src={avatar?.avatar_url}
          alt={avatar?.name ?? "Avatar"}
          className="w-10 h-10 rounded-full object-cover bg-[#242f3d]"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar?.name ?? "A")}&background=2b5278&color=fff`;
          }}
        />
        {/* Online dot */}
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#17212b]" />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-[15px] leading-tight truncate">
          {avatar?.name ?? "Loading..."}
        </p>
        <p className="text-green-400 text-xs leading-tight">online</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 text-[#7f91a4] hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <Search size={18} />
        </button>
        <button className="p-2 text-[#7f91a4] hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
