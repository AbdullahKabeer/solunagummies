'use client';

import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { DateRange as DayPickerRange } from "react-day-picker";

export type DateRange = {
  label: string;
  startDate: Date;
  endDate: Date;
};

interface DateRangePickerProps {
  onRangeChange: (range: DateRange) => void;
}

export default function DateRangePicker({ onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Today');
  const [showCustom, setShowCustom] = useState(false);

  const now = useMemo(() => new Date(), []);
  const todayStart = useMemo(
    () => new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    [now]
  );

  const [customRange, setCustomRange] = useState<DayPickerRange | undefined>(() => {
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(end);
    start.setDate(start.getDate() - 1);
    return { from: start, to: end };
  });

  const ranges = [
    {
      label: 'Today',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'Yesterday',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'Last 7 days',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        return { startDate: start, endDate: now };
      }
    },
    {
      label: 'Last 30 days',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        return { startDate: start, endDate: now };
      }
    },
    {
      label: 'Last 90 days',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 90);
        return { startDate: start, endDate: now };
      }
    },
    {
      label: 'Last 12 months',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
        return { startDate: start, endDate: now };
      }
    },
    {
      label: 'Year to date',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        return { startDate: start, endDate: now };
      }
    }
  ];

  const handleSelect = (range: typeof ranges[0]) => {
    setSelectedLabel(range.label);
    const { startDate, endDate } = range.getRange();
    onRangeChange({ label: range.label, startDate, endDate });
    setIsOpen(false);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (!customRange?.from || !customRange?.to) return;

    const start = new Date(customRange.from);
    start.setHours(0, 0, 0, 0);
    const end = new Date(customRange.to);
    end.setHours(23, 59, 59, 999);

    onRangeChange({ label: 'Custom', startDate: start, endDate: end });
    setSelectedLabel('Custom');
    setIsOpen(false);
    setShowCustom(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-background">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedLabel}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {!showCustom ? (
          <div className="flex flex-col p-1">
            {ranges.map((range) => (
              <Button
                key={range.label}
                variant="ghost"
                onClick={() => handleSelect(range)}
                className={cn(
                  "justify-start font-normal",
                  selectedLabel === range.label && "bg-accent text-accent-foreground font-medium"
                )}
              >
                {range.label}
              </Button>
            ))}
            <div className="border-t my-1" />
            <Button
              variant="ghost"
              onClick={() => setShowCustom(true)}
              className={cn(
                "justify-start font-normal",
                selectedLabel === 'Custom' && "bg-accent text-accent-foreground font-medium"
              )}
            >
              Custom...
            </Button>
          </div>
        ) : (
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase text-muted-foreground">Custom Range</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCustom(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="rounded-md border">
              <Calendar
                mode="range"
                numberOfMonths={1}
                selected={customRange}
                onSelect={setCustomRange}
                defaultMonth={customRange?.from ?? todayStart}
              />
            </div>

            <Button onClick={handleCustomApply} className="w-full mt-3">
              Apply
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
