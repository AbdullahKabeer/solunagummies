'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';

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
  
  // Initialize with current date/time for inputs
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formatForInput = (date: Date) => {
    // Adjust for local timezone offset to ensure input shows correct local time
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [customStart, setCustomStart] = useState(formatForInput(yesterday));
  const [customEnd, setCustomEnd] = useState(formatForInput(now));

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
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      const start = new Date(customStart);
      const end = new Date(customEnd);
      
      if (start > end) {
        alert('Start date cannot be after end date');
        return;
      }

      onRangeChange({ label: 'Custom', startDate: start, endDate: end });
      setSelectedLabel('Custom');
      setIsOpen(false);
      setShowCustom(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => {
          setIsOpen(!isOpen);
          setShowCustom(false);
        }}
        className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-sm font-medium hover:bg-gray-50"
      >
        <Calendar className="w-4 h-4 text-gray-500" />
        <span>{selectedLabel}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded shadow-lg z-20 py-1 overflow-hidden">
            {!showCustom ? (
              <>
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
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => setShowCustom(true)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                      selectedLabel === 'Custom' ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                    }`}
                  >
                    Custom...
                  </button>
                </div>
              </>
            ) : (
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase text-gray-500">Custom Range</span>
                  <button onClick={() => setShowCustom(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start</label>
                    <input 
                      type="datetime-local" 
                      value={customStart}
                      onChange={(e) => setCustomStart(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End</label>
                    <input 
                      type="datetime-local" 
                      value={customEnd}
                      onChange={(e) => setCustomEnd(e.target.value)}
                      className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                  
                  <button 
                    onClick={handleCustomApply}
                    className="w-full bg-black text-white text-sm font-medium py-1.5 rounded hover:bg-gray-800 transition-colors mt-2"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
