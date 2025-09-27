import React from "react";
import { Card } from "./ui/card";
import { ChevronRight } from "lucide-react";

const WorkLogCard = ({ data, isLoading, isError }) => {
  console.log("Da", data);
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {data?.data?.map((card, index) => {
        return (
          <div key={index} className="h-full">
            <Card className="w-full h-32 flex flex-row items-center justify-between px-4">
              <div className="flex items-center gap-4 w-full">
                <div className="border flex flex-col h-16 w-24 items-center rounded">
                  <span className="border-b-2 w-full text-center rounded-tl rounded-tr text-sm bg-cyan-600 text-white">
                    {new Date(card.date).getDate()}
                  </span>
                  <span className="w-full h-full text-center flex items-center justify-center text-xl font-semibold">
                    {new Date(card.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
                <span
                  className={`uppercase text-md ${
                    card?.status === "Received"
                      ? "text-green-600"
                      : card?.status === "not updated"
                      ? "text-red-600"
                      : "text-gray-600"
                  }  `}
                >
                  {card?.status || "Not Updated"}
                </span>
              </div>
              <span
                className={`${
                  !(card?.status === "not updated")
                    ? "text-gray-300 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
              >
                <ChevronRight size={30} />
              </span>
            </Card>
          </div>
        );
      })}
    </div>
  );
};

export default WorkLogCard;
