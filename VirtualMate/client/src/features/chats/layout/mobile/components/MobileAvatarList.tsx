import React from "react";
import { Search } from "lucide-react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { chatRoute } from "../../../chats.route";
import { useAvatars } from "../../../hooks/useAvatars";
import MobileHeader from "./MobileHeader";

/**
 * Full-screen avatar list for mobile.
 * Tapping an avatar sets `avatarId` in the URL, which triggers
 * MobileLayout to switch to MobileChatView.
 */
export default function MobileAvatarList() {
  const { data, isLoading, isError } = useAvatars();
  const { avatarId: activeId } = useSearch({ from: chatRoute.id });
  const navigate = useNavigate({ from: chatRoute.id });

  const avatars = data?.data ?? [];

  const handleSelectAvatar = (id: string) => {
    navigate({ search: { avatarId: id } });
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full bg-[#17212b] text-white font-sans overflow-hidden">
      <MobileHeader />

      {/* Search bar — separate row like Telegram mobile */}
      <div className="px-3 py-2 shrink-0">
        <div className="bg-[#242f3d] rounded-[22px] flex items-center px-4 py-2.5 gap-2.5">
          <Search className="text-[#7f91a4] w-4 h-4 shrink-0" />
          <input
            type="text"
            className="bg-transparent border-none text-white w-full text-sm outline-none placeholder-[#7f91a4]"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Avatar list */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#2b5278] border-t-transparent animate-spin" />
        </div>
      )}

      {isError && (
        <p className="p-4 text-[#ff5e5e] text-center text-sm">
          Error loading chats
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="flex-1 overflow-y-auto m-0 p-0 list-none [&::-webkit-scrollbar]:hidden">
          {avatars.map((avatar: any) => {
            const isActive = activeId === avatar._id;
            return (
              <li
                key={avatar._id}
                onClick={() => handleSelectAvatar(avatar._id)}
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-150 gap-3 ${
                  isActive ? "bg-[#2b5278]" : "active:bg-[#202b36]"
                }`}
              >
                {/* Avatar image with online dot */}
                <div className="relative shrink-0">
                  <img
                    src={avatar.avatar_url}
                    alt={avatar.name}
                    className="w-[42px] h-[42px] rounded-full object-cover bg-[#242f3d]"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=2b5278&color=fff`;
                    }}
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#17212b]" />
                </div>

                {/* Name + description */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-medium text-[15px] text-white truncate">
                      {avatar.name}
                    </span>
                    <span className="text-xs text-[#7f91a4] shrink-0">AI</span>
                  </div>
                  <p
                    className={`text-sm truncate leading-snug ${
                      isActive ? "text-[#a0bcdc]" : "text-[#7f91a4]"
                    }`}
                  >
                    {avatar.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
