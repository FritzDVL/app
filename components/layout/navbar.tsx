"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { TestnetBanner } from "../shared/testnet-banner";
import { LoginConnectButton } from "@/components/auth/login-connect-button";
import { LoginLensAccountsDialog } from "@/components/auth/login-lens-accounts-dialog";
import { ThemeToggle } from "@/components/theme/theme-toggle";
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
import { useLogout } from "@/hooks/auth/use-logout";
import { useAuthStore } from "@/stores/auth-store";
import { Bell, Gift, Home, LogOut, Menu, Plus, RefreshCw, Search, User, Users, X } from "lucide-react";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLensDialog, setShowLensDialog] = useState(false);
  const pathname = usePathname();
  const { account } = useAuthStore();
  const { logout } = useLogout();

  return (
    <nav className="sticky top-0 z-50 w-full max-w-full overflow-x-hidden border-b border-gray-200 bg-white/80 px-4 py-3 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      {/* Test Environment Banner */}
      {/* <TestnetBanner /> */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
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
          <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-brand-500 group-hover:to-brand-600 group-hover:drop-shadow-sm dark:from-brand-400 dark:to-brand-500">
            LensForum
          </span>
        </Link>

        {/* Desktop Actions */}
        <div className="hidden items-center space-x-3 md:flex">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "default" : "yellow"}
              size="sm"
              className="rounded-full px-4 py-2 transition-all duration-300"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/communities">
            <Button
              variant={pathname === "/communities" ? "default" : "yellow"}
              size="sm"
              className="rounded-full px-4 py-2 transition-all duration-300"
            >
              <Users className="mr-2 h-4 w-4" />
              Communities
            </Button>
          </Link>

          {/* Theme Toggle and Conditional rendering based on user connection */}
          <div className="flex items-center gap-3">
            {account && (
              <Link href="/notifications">
                <Button
                  variant={pathname === "/notifications" ? "default" : "yellow"}
                  size="icon"
                  className="relative p-2 transition-all duration-300"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <ThemeToggle />
            {account ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer border-2 border-slate-200/60 bg-white/80 shadow-md transition-all duration-300 hover:scale-105 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-100/50 dark:border-gray-600 dark:bg-gray-800">
                    <AvatarImage src={account.metadata?.picture || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback className="bg-gradient-to-br from-brand-400 to-brand-600 font-semibold text-white">
                      {account.username?.localName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] border border-border bg-white shadow-xl dark:bg-gray-800"
                >
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-yellow-100 hover:text-yellow-900 focus:bg-yellow-100 focus:text-yellow-900 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-200"
                  >
                    <Link href={`/u/${account.username?.localName || "user"}`}>
                      <User className="mr-2 h-4 w-4 text-brand-500" />
                      Go to profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-yellow-100 hover:text-yellow-900 focus:bg-yellow-100 focus:text-yellow-900 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-200"
                  >
                    <Link href={`/u/${account.username?.localName || "user"}/rewards`}>
                      <Gift className="mr-2 h-4 w-4 text-brand-500" />
                      Rewards
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowLensDialog(true)}
                    className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-yellow-100 hover:text-yellow-900 focus:bg-yellow-100 focus:text-yellow-900 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-200"
                  >
                    <RefreshCw className="mr-2 h-4 w-4 text-brand-500" />
                    Switch account
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 focus:bg-yellow-100 focus:text-yellow-900 dark:hover:bg-red-900/20 dark:hover:text-red-400"
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
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 rounded-2xl border-t border-border bg-white pb-4 shadow-lg backdrop-blur-md dark:bg-gray-800 md:hidden">
          <div className="space-y-3 pt-4">
            <div className="relative px-3">
              <Search className="absolute left-6 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="rounded-full border-border bg-background pl-10 transition-all duration-300 focus:bg-background focus:shadow-md"
              />
            </div>
            <Link href="/" className="block px-3">
              <Button
                variant="ghost"
                className={`w-full justify-start rounded-full transition-all duration-300 ${
                  pathname === "/"
                    ? "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                    : "hover:bg-accent hover:text-accent-foreground"
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
                    ? "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Communities
              </Button>
            </Link>
            {account && (
              <Link href="/notifications" className="block px-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full transition-all duration-300 ${
                    pathname === "/notifications"
                      ? "bg-brand-600 text-white shadow-md hover:bg-brand-700"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    3
                  </span>
                </Button>
              </Link>
            )}
            {account ? (
              <Link href={`/u/${account.username?.localName || "user"}`} className="block px-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-full transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <div className="px-3">
                <div className="rounded-full bg-gradient-to-r from-brand-50 to-white p-1 shadow-md backdrop-blur-sm dark:from-gray-800 dark:to-gray-700">
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
