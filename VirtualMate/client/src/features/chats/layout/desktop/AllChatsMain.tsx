import React from "react";
import { useMediaQuery } from "../../../../hooks/useMediaQuery";
import DesktopLayout from "./DesktopLayout";
import MobileLayout from "../mobile/MobileLayout";

export default function AllChatsMain() {
  // Tailwind's `md` breakpoint = 768px
  const isMobile = useMediaQuery("(max-width: 767px)");
  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
