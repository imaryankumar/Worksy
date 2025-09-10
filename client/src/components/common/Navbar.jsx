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
    <nav className="w-full flex items-center justify-between h-16 px-4 md:px-6">
      <div className="flex-1 flex items-center max-w-2xl">
        <div className="flex w-full items-center px-4 py-3 relative shadow-sm border rounded-3xl bg-background">
          <Search size={20} className="text-muted-foreground mr-2" />
          <input
            type="text"
            className="w-full border-none bg-transparent outline-none text-sm"
            placeholder="Search here"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-6 ml-4">
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium rounded-full px-1 py-0.5">
            0
          </span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar className="h-9 w-9 border">
                <AvatarImage src="/placeholder-user.jpg" alt={username} />
                <AvatarFallback>
                  {username.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium truncate max-w-[120px]">
                {username}
              </span>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
