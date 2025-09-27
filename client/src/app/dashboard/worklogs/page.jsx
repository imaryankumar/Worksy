"use client";
import { Button } from "@/components/ui/button";
import WorkLogCard from "@/components/WorkLogCard";
import axiosInstance from "@/lib/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ClipboardMinus, Plus } from "lucide-react";
import React from "react";

const WorkLogs = () => {
  const fetchWorkData = async () => {
    const response = await axiosInstance.get(`/api/v1/worklog/all-works`);
    return response.data;
  };
  const { isError, isLoading, data } = useQuery({
    queryKey: ["work"],
    queryFn: fetchWorkData,
    staleTime: 10000,
  });

  return (
    <div className="w-full h-full relative">
      <div className="w-full flex flex-col gap-8">
        <div className="w-full flex items-start justify-between">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <span className="p-1 rounded bg-gray-200">
              <ClipboardMinus color="#163CC7" size={30} />
            </span>
            Work Reports
          </h2>
          <Button className="bg-black text-white cursor-pointer">
            <Plus />
            Add Works
          </Button>
        </div>
        <div className="w-full h-full relative">
          <WorkLogCard data={data} isError={isError} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default WorkLogs;
