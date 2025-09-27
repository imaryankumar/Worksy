"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import DatePicker from "@/utils/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

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

// API functions
const fetchLeaveData = async (date) => {
  const response = await axiosInstance.get(`/api/v1/leave/?date=${date}`);
  return response.data;
};

const submitLeaveApplication = async (payload) => {
  const response = await axiosInstance.post("/api/v1/leave/add", payload);
  return response.data;
};

const Leaves = () => {
  const queryClient = useQueryClient();

  // Modal and form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: undefined,
    endDate: undefined,
    reason: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date helper - memoized
  const formatDate = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }, []);

  // Current formatted date - memoized
  const currentFormattedDate = useMemo(
    () => formatDate(selectedDate),
    [formatDate, selectedDate]
  );

  // Query for fetching leave data
  const {
    data: leaveData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["leaves", currentFormattedDate],
    queryFn: () => fetchLeaveData(currentFormattedDate),
    retry: 2,
    enabled: !!currentFormattedDate,
  });

  // Mutation for submitting leave application
  const leaveSubmissionMutation = useMutation({
    mutationFn: submitLeaveApplication,
    onSuccess: (data) => {
      toast.success("Leave application submitted successfully!", {
        id: "leave-success",
      });

      // Invalidate and refetch leave data
      queryClient.invalidateQueries({
        queryKey: ["leaves", currentFormattedDate],
      });

      // Close modal and reset form
      setIsModalOpen(false);
      resetForm();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to submit leave application";
      toast.error(errorMessage, {
        id: "leave-error",
      });
    },
  });

  // Form handlers - memoized
  const resetForm = useCallback(() => {
    setFormData({
      leaveType: "",
      startDate: undefined,
      endDate: undefined,
      reason: "",
    });
  }, []);

  const handleFormDataChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  // Form validation
  const isFormValid = useMemo(() => {
    return (
      formData.leaveType &&
      formData.startDate &&
      formData.endDate &&
      formData.reason?.trim()
    );
  }, [formData]);

  // Form submission handler
  const onLeaveSubmitHandler = useCallback(
    async (e) => {
      e.preventDefault();

      if (!isFormValid) {
        toast.error("All fields are required!", {
          id: "validation-error",
        });
        return;
      }

      const payload = {
        leaveType: formData.leaveType,
        startDate: formatDate(formData.startDate),
        endDate: formatDate(formData.endDate),
        reason: formData.reason.trim(),
      };

      leaveSubmissionMutation.mutate(payload);
    },
    [isFormValid, formData, formatDate, leaveSubmissionMutation]
  );

  // Modal close handler
  const handleModalClose = useCallback(
    (open) => {
      setIsModalOpen(open);
      if (!open) {
        resetForm();
      }
    },
    [resetForm]
  );

  return (
    <div className="w-full h-full">
      <div className="flex flex-col items-start justify-center gap-12">
        <div className="w-full flex items-center justify-between">
          <h2 className="w-full text-3xl font-medium capitalize">
            Our Team Buddy{" "}
            <span className="text-cyan-700 font-semibold">Leave today</span>
          </h2>
          <div className="flex items-center justify-center gap-6">
            <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white text-base">
                  <Plus />
                  Leave Apply
                </Button>
              </DialogTrigger>
              <DialogContent
                className="sm:max-w-[425px] md:max-w-[625px] bg-white !border-none"
                onInteractOutside={(event) => event.preventDefault()}
                aria-describedby={undefined}
              >
                <DialogHeader>
                  <DialogTitle>Leave Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={onLeaveSubmitHandler}>
                  <div className="grid gap-4 py-4">
                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="leave-type" className="font-semibold">
                        Select Leave Type
                        <span className="text-red-500"> *</span>
                      </Label>
                      <Select
                        value={formData.leaveType}
                        onValueChange={(value) =>
                          handleFormDataChange("leaveType", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Leave Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-60 overflow-y-auto">
                          <SelectGroup>
                            {leaveTypes.map((leave, index) => (
                              <SelectItem
                                key={index}
                                value={leave}
                                className="cursor-pointer hover:bg-gray-100"
                              >
                                {leave}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="start-date" className="font-semibold">
                        Start Date<span className="text-red-500"> *</span>
                      </Label>
                      <DatePicker
                        date={formData.startDate}
                        handleDateChange={(date) =>
                          handleFormDataChange("startDate", date)
                        }
                        width="w-full"
                        isShowDate={true}
                      />
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="end-date" className="font-semibold">
                        End Date<span className="text-red-500"> *</span>
                      </Label>
                      <DatePicker
                        date={formData.endDate}
                        handleDateChange={(date) =>
                          handleFormDataChange("endDate", date)
                        }
                        width="w-full"
                        isShowDate={true}
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="reason" className="font-semibold">
                        Reason<span className="text-red-500"> *</span>
                      </Label>
                      <Textarea
                        id="reason"
                        value={formData.reason}
                        className="w-full resize-none outline-none focus-visible:ring-0"
                        placeholder="Enter your reason"
                        onChange={(e) =>
                          handleFormDataChange("reason", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={
                        leaveSubmissionMutation.isPending || !isFormValid
                      }
                      className="disabled:opacity-50 disabled:cursor-not-allowed text-white cursor-pointer"
                    >
                      {leaveSubmissionMutation.isPending
                        ? "Submitting..."
                        : "Submit Leave"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <DatePicker
              date={selectedDate}
              handleDateChange={handleDateChange}
            />
          </div>
        </div>

        <div className="w-full">
          <ProfileCard
            isLoading={isLoading}
            isError={isError}
            data={leaveData?.allLeaves}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default Leaves;
