"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Home, Menu, Plus, Search, User, X } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-brand-50 to-brand-100 dark:from-gray-900 dark:via-brand-900/20 dark:to-brand-800/20">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-brand-200/50 bg-white/80 backdrop-blur-xl dark:border-brand-800/50 dark:bg-gray-900/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-2">
            <div className="flex h-8 w-8 transform items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 transition-transform duration-200 group-hover:scale-110">
              <span className="text-sm font-bold text-white">L</span>
            </div>
            <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-xl font-bold text-transparent">
              LensForum
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search forums, threads, users..."
                className="rounded-full border-brand-200/50 bg-white/50 pl-10 focus:border-brand-400"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 md:flex">
            <Button variant="ghost" size="sm" className="rounded-full">
              <Bell className="h-4 w-4" />
            </Button>
            <Button className="transform rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-200 hover:scale-105 hover:from-brand-600 hover:to-brand-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Forum
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-brand-200 transition-all hover:ring-brand-400">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">U</AvatarFallback>
            </Avatar>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-brand-200/50 bg-white/95 backdrop-blur-xl dark:bg-gray-900/95 md:hidden">
            <div className="container mx-auto space-y-4 px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input placeholder="Search..." className="rounded-full border-brand-200/50 bg-white/50 pl-10" />
              </div>
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" className="justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="ghost" className="justify-start">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
                <Button className="rounded-full bg-gradient-to-r from-brand-500 to-brand-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Forum
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
