"use client";

import { NavbarDesktop } from "@/components/layout/navbar-desktop";
import { NavbarMobile } from "@/components/layout/navbar-mobile";
import { useIsMobile } from "@/hooks/common/use-mobile";

export function Navbar() {
  const isMobile = useIsMobile();

  // Return mobile navbar if mobile, desktop navbar if not mobile
  return isMobile ? <NavbarMobile /> : <NavbarDesktop />;
}
