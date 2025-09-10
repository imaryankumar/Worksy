"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell, Sun, Moon, ChevronDown, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar({ username = "John Doe", onLogout }) {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="flex items-center w-full px-5 py-3 justify-center rounded-3xl shadow bg-gray-50">
          <Search size={20} className="text-gray-400 mr-2" />
          <input
            type="text"
            className="w-full border-none bg-transparent outline-none text-sm text-gray-700 dark:text-gray-200"
            placeholder="Search here"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 md:gap-6 ml-4">
        {/* Notification */}
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-gray-50 !border-none"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full px-1 py-0.5">
            0
          </span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gray-50 !border-none"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-9 w-9 bg-gray-50">
                <AvatarImage src="/placeholder-user.jpg" alt={username} />
                <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium truncate max-w-[120px]">
                {username}
              </span>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
