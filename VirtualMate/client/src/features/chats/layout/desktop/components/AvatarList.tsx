import React, { useState } from "react";
import { useAvatars } from "../../../hooks/useAvatars";

export default function AvatarList() {
  const { data, isLoading, isError } = useAvatars();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (isLoading) return <div className="p-4 text-[#7f91a4] text-center">Loading...</div>;
  if (isError) return <div className="p-4 text-[#ff5e5e] text-center">Error loading avatars</div>;

  const avatars = data?.data || [];

  return (
    <ul className="flex-1 overflow-y-auto m-0 p-0 list-none [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#7f91a4]/30 [&::-webkit-scrollbar-thumb]:rounded-md">
      {avatars.map((avatar: any) => {
        const isActive = activeId === avatar._id;
        return (
          <li 
            key={avatar._id} 
            className={`flex items-center px-3 py-2.5 cursor-pointer transition-colors duration-200 gap-3 rounded-[10px] mx-2 my-1 ${
              isActive ? 'bg-[#2b5278]' : 'hover:bg-[#202b36]'
            }`}
            onClick={() => setActiveId(avatar._id)}
          >
            <img 
              src={avatar.avatar_url} 
              alt={avatar.name} 
              className="w-[50px] h-[50px] rounded-full object-cover bg-[#242f3d] shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(avatar.name)}&background=2b5278&color=fff`;
              }}
            />
            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
              <div className="flex justify-between items-center">
                <span className="font-medium text-[15px] whitespace-nowrap overflow-hidden text-ellipsis text-white">{avatar.name}</span>
                <span className={`text-xs shrink-0 ${isActive ? 'text-[#a0bcdc]' : 'text-[#7f91a4]'}`}></span>
              </div>
              <div className={`text-sm whitespace-nowrap overflow-hidden text-ellipsis leading-[1.3] ${isActive ? 'text-[#a0bcdc]' : 'text-[#7f91a4]'}`}>
                {avatar.description}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
