"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginConnectButton } from "@/components/login-connect-button";
import { LoginLensAccountsDialog } from "@/components/login-lens-accounts-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useLogout } from "@/hooks/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import {
  // Bell,
  Home,
  LogOut,
  Menu,
  Plus,
  RefreshCw,
  Search,
  User,
  Users,
  X,
} from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLensDialog, setShowLensDialog] = useState(false);
  const pathname = usePathname();
  const { account } = useAuthStore();
  const { logout } = useLogout();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center transition-transform group-hover:scale-110">
            <Image src="/logo.png" alt="LensForum Logo" width={32} height={32} className="rounded-lg" />
          </div>
          <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-xl font-bold text-transparent">
            LensForum
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search forums, threads, users..."
              className="pl-10 bg-white/50 border-white/30 focus:bg-white/80 transition-all duration-200 rounded-full"
            />
          </div>
        </div> */}

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/">
            <Button variant={pathname === "/" ? "default" : "ghost"} size="sm">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/communities">
            <Button variant={pathname === "/communities" ? "default" : "ghost"} size="sm">
              <Users className="mr-2 h-4 w-4" />
              Communities
            </Button>
          </Link>
          {/* <Button className="gradient-button rounded-full px-4 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Create Forum
          </Button>{" "}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-xs">
              3
            </Badge>
          </Button> */}
          {/* Conditional rendering based on user connection */}
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border-2 border-border transition-all hover:border-brand-300">
                  <AvatarImage src={account.metadata?.picture || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback>{account.username?.localName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] border border-border bg-white shadow-md">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href={`/u/${account.username?.localName || "user"}`}>
                    <User className="mr-2 h-4 w-4 text-brand-500" />
                    Go to profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowLensDialog(true)} className="cursor-pointer">
                  <RefreshCw className="mr-2 h-4 w-4 text-brand-500" />
                  Switch account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4 text-brand-500" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginConnectButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 border-t border-border bg-white pb-4 md:hidden">
          <div className="space-y-3 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input placeholder="Search..." className="border-border bg-white pl-10" />
            </div>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/communities" className="block">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Communities
              </Button>
            </Link>
            {account ? (
              <Link href={`/u/${account.username?.localName || "user"}`} className="block">
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <div className="px-3">
                <LoginConnectButton />
              </div>
            )}
            <Button className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Create Thread
            </Button>
          </div>
        </div>
      )}

      {/* Lens Accounts Dialog */}
      <LoginLensAccountsDialog isOpen={showLensDialog} onClose={() => setShowLensDialog(false)} />
    </nav>
  );
}
