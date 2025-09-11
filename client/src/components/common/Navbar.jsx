"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Bell, Sun, Moon, ChevronDown, LogOut, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutUserAPI } from "@/store/slices/authSlice/getAuthSlice";
import { useEffect, useState } from "react";

export default function Navbar({ onLogout }) {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [user, setUser] = useState({
    name: "John Doe",
    profilePic: "/placeholder-user.jpg",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || "John Doe",
        profilePic: parsedUser.profilePic || "/placeholder-user.jpg",
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAPI()).unwrap();
      router.push("/login");
      if (onLogout) onLogout();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="flex items-center w-full px-5 py-3 justify-center rounded-3xl shadow bg-gray-100">
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
            className="rounded-full bg-gray-100 !border-none"
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
          className="rounded-full bg-gray-100 !border-none"
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
              <Avatar className="h-9 w-9 bg-gray-100">
                <AvatarImage src={user.profilePic} alt={user.name} />
                <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="hidden md:block font-medium truncate max-w-[120px]">
                {user.name}
              </span>
              <ChevronDown className="h-4 w-4 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-36 !border-none bg-gray-100"
          >
            <DropdownMenuItem
              className="cursor-pointer text-blue-700 font-medium text-md"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
