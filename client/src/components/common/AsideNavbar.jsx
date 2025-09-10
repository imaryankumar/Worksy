"use client";

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
import { useState } from "react";

const AsideNavbar = () => {
  const pathname = usePathname().slice(1);
  const [activeRouteId, setActiveRouteId] = useState(pathname);

  const routes = [
    {
      id: 1,
      label: "Overview",
      url: "overview",
      icon: <PieChart size={22} />,
    },
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
    {
      id: 4,
      label: "Attendance",
      url: "attendance",
      icon: <Book size={22} />,
    },
    {
      id: 5,
      label: "Inventory",
      url: "inventory",
      icon: <Package size={22} />,
    },
    {
      id: 6,
      label: "Profile",
      url: "profile",
      icon: <User size={22} />,
    },
  ];

  const handleRouteChange = (id) => {
    setActiveRouteId(id);
  };

  return (
    <div className="relative flex flex-col justify-between h-full py-5">
      <div className="flex flex-col gap-10 items-center justify-start">
        <div className="px-12">
          <Image
            src={CONSTANTS.LOGO}
            alt="Company Logo"
            className="blend-image"
            priority
          />
        </div>
        <nav className="flex flex-col gap-3 w-full px-5">
          {routes.map((route) => {
            const isActive = activeRouteId === route.url;
            return (
              <Link
                key={route.id}
                href={route.url}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  onClick={() => handleRouteChange(route.url)}
                  className={`flex items-center gap-3 py-2 px-6 cursor-pointer rounded-md transition-colors duration-200 
                    ${
                      isActive
                        ? "bg-black text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-200"
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
      <div className="px-5 mt-6">
        <div className="flex items-center gap-4 p-3 border rounded-xl shadow-sm hover:shadow-md transition">
          <Image
            src={CONSTANTS.LOGO}
            alt="User Profile"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-800">
              Aryan Kumar
            </span>
            <span className="text-xs text-gray-500">Frontend Engineer</span>
            <span className="text-xs text-gray-400">aryan@example.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsideNavbar;
