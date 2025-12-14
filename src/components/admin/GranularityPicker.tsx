'use client';

import { useState } from 'react';
import { Clock, ChevronDown } from 'lucide-react';

interface GranularityPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GranularityPicker({ value, onChange }: GranularityPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { value: 'auto', label: 'Auto' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
  ];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const currentLabel = options.find(o => o.value === value)?.label || 'Auto';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm text-sm font-medium hover:bg-gray-50"
      >
        <Clock className="w-4 h-4 text-gray-500" />
        <span>{currentLabel}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-20 py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                  value === opt.value ? 'font-bold text-blue-600 bg-blue-50' : 'text-gray-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
