'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

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

  const ranges = [
    {
      label: 'Today',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        return { startDate: start, endDate: end };
      }
    },
    {
      label: 'Yesterday',
      getRange: () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
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
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-sm font-medium hover:bg-gray-50"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{selectedLabel}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-20 py-1">
            {ranges.map((range) => (
              <button
                key={range.label}
                onClick={() => handleSelect(range)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  selectedLabel === range.label ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
