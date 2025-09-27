"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";

// Custom date formatter - no external dependency
const formatDate = (date) => {
  if (!date) return null;

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

const DatePicker = ({
  date,
  handleDateChange,
  width = "w-[240px]",
  placeholder = "Pick a date",
  isShowDate = false,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`${width} bg-white justify-start text-left font-normal ${
            !date && "text-muted-foreground"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 bg-white !border-none outline-none"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          className="rounded-md border cursor-pointer shadow bg-gray-300"
          initialFocus
          disabled={isShowDate ? { before: new Date() } : undefined}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
