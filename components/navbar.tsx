"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoginConnectButton } from "@/components/login-connect-button";
import { LoginLensAccountsDialog } from "@/components/login-lens-accounts-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Home, LogOut, Menu, Plus, RefreshCw, Search, User, Users, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLensDialog, setShowLensDialog] = useState(false);
  const pathname = usePathname();
  const { account } = useAuthStore();
  const { logout } = useLogout();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 px-4 py-3 shadow-xl shadow-slate-200/20 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center">
            <Image
              src="/logo.png"
              alt="LensForum Logo"
              width={32}
              height={32}
              className="rounded-lg transition-all duration-300 group-hover:shadow-brand-200/50"
            />
          </div>
          <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:drop-shadow-sm">
            LensForum
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-4 py-2 transition-all duration-300 ${
                pathname === "/"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-200/60"
                  : ""
              }`}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/communities">
            <Button
              variant={pathname === "/communities" ? "default" : "ghost"}
              size="sm"
              className={`rounded-full px-4 py-2 transition-all duration-300 ${
                pathname === "/communities"
                  ? "bg-brand-600 text-white shadow-lg shadow-brand-200/50 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-200/60"
                  : ""
              }`}
            >
              <Users className="mr-2 h-4 w-4" />
              Communities
            </Button>
          </Link>

          {/* Conditional rendering based on user connection */}
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border-2 border-slate-200/60 bg-white/80 shadow-md transition-all duration-300 hover:scale-105 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50">
                  <AvatarImage src={account.metadata?.picture || "/placeholder.svg?height=32&width=32"} />
                  <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                    {account.username?.localName?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[200px] border border-slate-200/60 bg-white/95 shadow-xl shadow-slate-200/20 backdrop-blur-md"
              >
                <DropdownMenuItem
                  asChild
                  className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-slate-100/80"
                >
                  <Link href={`/u/${account.username?.localName || "user"}`}>
                    <User className="mr-2 h-4 w-4 text-brand-500" />
                    Go to profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowLensDialog(true)}
                  className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-slate-100/80"
                >
                  <RefreshCw className="mr-2 h-4 w-4 text-brand-500" />
                  Switch account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-200/60" />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50/80 hover:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4 text-red-500" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginConnectButton />
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-all duration-300 hover:bg-slate-100/80 hover:shadow-md md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 rounded-2xl border-t border-slate-200/60 bg-white/90 pb-4 shadow-lg shadow-slate-200/20 backdrop-blur-md md:hidden">
          <div className="space-y-3 pt-4">
            <div className="relative px-3">
              <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
              <Input
                placeholder="Search..."
                className="rounded-full border-slate-200/60 bg-white/80 pl-10 backdrop-blur-sm transition-all duration-300 focus:bg-white focus:shadow-md focus:shadow-slate-200/20"
              />
            </div>
            <Link href="/" className="block px-3">
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-full transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                    : "hover:bg-slate-100/80 hover:shadow-sm"
                }`}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/communities" className="block px-3">
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-full transition-all duration-300 ${
                  pathname === "/communities"
                    ? "bg-orange-600 text-white shadow-md hover:bg-orange-700"
                    : "hover:bg-orange-100/80 hover:text-orange-700 hover:shadow-sm"
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Communities
              </Button>
            </Link>
            {account ? (
              <Link href={`/u/${account.username?.localName || "user"}`} className="block px-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-full transition-all duration-300 hover:bg-slate-100/80 hover:shadow-sm"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <div className="px-3">
                <div className="rounded-full bg-gradient-to-r from-brand-50 to-white p-1 shadow-md backdrop-blur-sm">
                  <LoginConnectButton />
                </div>
              </div>
            )}
            <div className="px-3">
              <Button className="w-full rounded-full bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-200/50 transition-all duration-300 hover:from-brand-700 hover:to-brand-800 hover:shadow-xl hover:shadow-brand-200/60">
                <Plus className="mr-2 h-4 w-4" />
                Create Thread
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lens Accounts Dialog */}
      <LoginLensAccountsDialog isOpen={showLensDialog} onClose={() => setShowLensDialog(false)} />
    </nav>
  );
}
