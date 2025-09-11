import { Card, CardContent } from "@/components/ui/card";
import {
  PhoneCall,
  Copy,
  BookTypeIcon,
  MailIcon,
  CopyIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { HoverCard } from "@radix-ui/react-hover-card";
import { HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { DateFormat } from "@/lib/DateFormat";

const ProfileCard = ({ isLoading, isError, data }) => {
  const onHandleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!", { id: "text-copy" });
  };

  const employees = data?.allDetails?.employees || [];
  const employeeCount = employees.length || 10;

  if (isError) {
    return (
      <p className="text-red-500 text-center w-full mt-4">
        Something went wrong. Please try again.
      </p>
    );
  }

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {isLoading ? (
        Array.from({ length: employeeCount }).map((_, index) => (
          <Card
            key={index}
            className="w-full h-72 shadow-md border border-gray-200 animate-pulse"
          >
            <CardContent className="flex flex-col items-center justify-start gap-4 p-6 w-full h-full">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-52 h-5" />
              <Skeleton className="w-52 h-5" />
              <Skeleton className="w-52 h-8" />
            </CardContent>
          </Card>
        ))
      ) : employees.length > 0 ? (
        employees.map((employee) => (
          <Card
            key={employee._id}
            className="w-full shadow-md hover:shadow-lg border border-gray-200 transition-shadow duration-300 relative"
          >
            {employee.status && (
              <span
                className={`absolute right-0 top-2 px-3 py-1 w-24 rounded-tl-lg rounded-bl-lg text-white text-sm font-medium ${
                  employee.status === "Pending"
                    ? "bg-orange-400"
                    : "bg-green-500"
                }`}
              >
                {employee.status}
              </span>
            )}
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <img
                src={employee.profilePic}
                alt={`${employee.fullName}'s profile`}
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div className="text-center flex flex-col gap-1">
                <h3 className="text-lg font-bold">{employee.fullName}</h3>
                <p className="text-sm text-gray-600 px-2 py-0.5 rounded-full bg-slate-200">
                  {employee.designation}
                </p>
              </div>

              <div className="text-sm flex flex-col gap-1 w-full text-gray-700">
                <div className="flex justify-between w-full">
                  <span>EmployeeId:</span>
                  <span>{employee.employeeId}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span>Join Date:</span>
                  <span>{DateFormat(employee.dateOfJoining)}</span>
                </div>
              </div>

              <div className="flex justify-between w-full mt-2">
                {/* Phone */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 rounded-xl border bg-gray-200 hover:bg-gray-300 transition-colors">
                      <PhoneCall />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex gap-2 items-center">
                    <span>{employee.phoneNumber}</span>
                    <CopyIcon
                      size={18}
                      className="cursor-pointer"
                      onClick={() => onHandleCopy(employee.phoneNumber)}
                    />
                  </HoverCardContent>
                </HoverCard>

                {/* Role */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 rounded-xl border bg-gray-200 hover:bg-gray-300 transition-colors">
                      <BookTypeIcon />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <span>{employee.role}</span>
                  </HoverCardContent>
                </HoverCard>

                {/* Email */}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="p-2 rounded-xl border bg-gray-200 hover:bg-gray-300 transition-colors">
                      <MailIcon />
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex gap-2 items-center">
                    <span>{employee.email}</span>
                    <CopyIcon
                      size={18}
                      className="cursor-pointer"
                      onClick={() => onHandleCopy(employee.email)}
                    />
                  </HoverCardContent>
                </HoverCard>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center col-span-full mt-4">
          No employees found.
        </p>
      )}
    </div>
  );
};

export default ProfileCard;
