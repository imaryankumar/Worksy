"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import DatePicker from "@/utils/DatePicker";

export const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Half-Day Leave (Casual)",
  "Half-Day Leave (Sick)",
  "Compensatory Leave (India)",
  "Compensatory Leave (Egypt)",
  "Work From Home",
  "Marriage Leave (Self)",
  "Parental Leave",
  "Parental Work From Home",
  "Birthday Month leave",
];

const Leaves = ({ data, isLoading, isError }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(undefined);
  const [endDate, setEndDate] = useState(undefined);
  const onLeaveSubmitHandler = () => {};
  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-start justify-center gap-12">
        <div className="w-full flex items-center justify-between">
          <h2 className="w-full text-3xl font-medium capitalize">
            Our Team Buddy{" "}
            <span className="text-cyan-700 font-semibold"> Leave today</span>
          </h2>
          <div className="flex items-center justify-center gap-6">
            <div>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-black text-white text-base">
                    <Plus />
                    Leave Apply
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[425px] md:max-w-[625px]"
                  onInteractOutside={(event) => event.preventDefault()}
                  aria-describedby={undefined}
                >
                  <DialogHeader>
                    <DialogTitle>Leave Application</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="select" className="font-semibold">
                        Select Leave Type
                        <span className="text-red-500"> *</span>
                      </Label>
                      <Select onValueChange={(value) => setIsLeaveType(value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Leave Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Leave Type</SelectLabel>
                            {leaveTypes.map((leave, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={leave}
                                  className="cursor-pointer"
                                >
                                  {leave}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="end" className="font-semibold">
                        Start Date<span className="text-red-500"> *</span>
                      </Label>
                      <DatePicker
                        date={startDate}
                        // handleDateChange={handleStartDateChange}
                        width="w-full"
                      />
                    </div>
                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="start" className="font-semibold">
                        End Date<span className="text-red-500"> *</span>
                      </Label>
                      <DatePicker date={endDate} width="w-full" />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="reason" className="font-semibold">
                        Reason<span className="text-red-500"> *</span>
                      </Label>
                      {/* <Textarea
                        id="reason"
                        placeholder="Enter your reason"
                        onChange={(e) => setReasonData(e.target.value)}
                      /> */}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={data}
                      onClick={onLeaveSubmitHandler}
                      className="disabled:opacity-80"
                    >
                      {data ? "Loading.." : "Leave Submit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div>
              <DatePicker date={startDate} />
            </div>
          </div>
        </div>
        <div className="w-full ">
          <ProfileCard isLoading={isLoading} isError={isError} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Leaves;
