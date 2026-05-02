import React from "react";
import AvatarList from "./AvatarList";
import { Menu, Search } from "lucide-react";

export default function AvatarSidebar() {
  return (
    <div className="w-[320px] min-w-[320px] bg-[#17212b] border-r border-[#0e1621] flex flex-col h-full">
      <div className="px-4 py-3 flex items-center gap-4">
        <button className="text-[#7f91a4] hover:bg-[#202b36] hover:text-white p-2 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer border-none bg-transparent">
          <Menu size={20} />
        </button>
        <div className="flex-1 bg-[#242f3d] rounded-[22px] flex items-center px-4 py-2 gap-2.5">
          <Search className="text-[#7f91a4] w-[18px] h-[18px]" />
          <input 
            type="text" 
            className="bg-transparent border-none text-white w-full text-sm outline-none placeholder-[#7f91a4]" 
            placeholder="Search" 
          />
        </div>
      </div>
      <AvatarList />
    </div>
  );
}
