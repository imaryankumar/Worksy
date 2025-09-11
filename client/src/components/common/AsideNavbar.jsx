"use client";

import { useEffect, useState } from "react";
import { CONSTANTS } from "@/lib/constants";
import {
  Book,
  Briefcase,
  CalendarCheck,
  Package,
  PieChart,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AsideNavbar = () => {
  const pathname = usePathname().replace("/", "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const routes = [
    { id: 1, label: "Overview", url: "overview", icon: <PieChart size={22} /> },
    {
      id: 2,
      label: "Leaves",
      url: "leaves",
      icon: <CalendarCheck size={22} />,
    },
    {
      id: 3,
      label: "Worklogs",
      url: "worklogs",
      icon: <Briefcase size={22} />,
    },
    { id: 4, label: "Attendance", url: "attendance", icon: <Book size={22} /> },
    {
      id: 5,
      label: "Inventory",
      url: "inventory",
      icon: <Package size={22} />,
    },
    { id: 6, label: "Profile", url: "profile", icon: <User size={22} /> },
  ];

  return (
    <div className="flex flex-col justify-between h-full py-5">
      <div className="flex flex-col gap-10 items-center">
        <div className="px-4">
          <Image src={CONSTANTS?.LOGO} alt="Company Logo" priority />
        </div>
        <nav className="flex flex-col gap-3 w-full px-5">
          {routes.map((route) => {
            const isActive = pathname === route.url;
            return (
              <Link key={route.id} href={`/${route.url}`}>
                <div
                  className={`flex items-center gap-3 py-2 px-4 rounded-md cursor-pointer transition-colors duration-200 ${
                    isActive
                      ? "bg-black text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  <span>{route.icon}</span>
                  <span className="text-lg font-medium capitalize">
                    {route.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
      {user && (
        <div className="px-5 mt-6">
          <div className="flex items-center gap-4 p-3 rounded-xl shadow-sm hover:shadow-md bg-gray-100">
            <Image
              src={user?.profilePic || CONSTANTS?.LOGO}
              alt="User Profile"
              width={45}
              height={45}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                {user?.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {user?.email}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsideNavbar;
