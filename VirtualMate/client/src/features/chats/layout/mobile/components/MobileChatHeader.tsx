import React from "react";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { chatRoute } from "../../../chats.route";

interface Avatar {
  _id: string;
  name: string;
  avatar_url: string;
}

interface MobileChatHeaderProps {
  avatar?: Avatar;
}

/**
 * Mobile-only chat screen header.
 * Has a back arrow that clears `avatarId` to return to the avatar list.
 */
export default function MobileChatHeader({ avatar }: MobileChatHeaderProps) {
  const navigate = useNavigate({ from: chatRoute.id });

  const handleBack = () => {
    navigate({ search: {} });
  };

  return (
    <div className="h-[56px] shrink-0 bg-[#17212b] border-b border-[#0e1621] flex items-center px-2 gap-1">
      {/* Back arrow */}
      <button
        onClick={handleBack}
        aria-label="Back to chats"
        className="p-2 text-[#7f91a4] hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
      >
        <ArrowLeft size={22} />
      </button>

      {/* Avatar image */}
      <div className="relative shrink-0">
        <img
          src={avatar?.avatar_url}
          alt={avatar?.name ?? "Avatar"}
          className="w-9 h-9 rounded-full object-cover bg-[#242f3d]"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar?.name ?? "A")}&background=2b5278&color=fff`;
          }}
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#17212b]" />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0 ml-2">
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
