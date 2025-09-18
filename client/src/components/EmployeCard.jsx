"use client";

import { UserCheck, UserMinus, UserPlus, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const EmployeeCard = ({ userCount }) => {
  const employeeStats = [
    {
      id: 1,
      icon: <Users size={24} className="text-primary" />,
      count: userCount?.total || 0,
      label: "Total Employee",
      bgColor: "bg-[#F5F1FF]",
    },

    {
      id: 2,
      icon: <UserCheck size={24} className="text-primary" />,
      count: userCount?.male || 0,
      label: "Male",
      bgColor: "bg-[#E0F5EE]",
    },
    {
      id: 3,
      icon: <UserMinus size={24} className="text-primary" />,
      count: userCount?.female || 0,
      label: "Female",
      bgColor: "bg-[#EBF0FF]",
    },
    {
      id: 4,
      icon: <UserPlus size={24} className="text-primary" />,
      count: userCount?.latest || 0,
      label: "New Employee",
      bgColor: "bg-[#FDF3EC]",
    },
  ];

  return (
    <div className="w-full flex flex-wrap gap-6">
      {employeeStats.map((item) => (
        <div key={item.id} className="flex-1 min-w-[200px]">
          <Card className={`${item.bgColor} !py-5 shadow-none !border-none`}>
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-6 sm:p-8">
                <span className="flex items-center justify-center text-xl bg-white rounded-full p-3 sm:p-4">
                  {item.icon}
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-sm sm:text-md font-semibold text-gray-700">
                    {item.label}
                  </span>
                  <span className="text-md sm:text-lg text-gray-600 font-medium">
                    {item.count}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default EmployeeCard;
