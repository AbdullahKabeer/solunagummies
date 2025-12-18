'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Clock } from 'lucide-react';

interface GranularityPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function GranularityPicker({ value, onChange }: GranularityPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[140px] bg-background">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <SelectValue placeholder="Select granularity" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="hourly">Hourly</SelectItem>
        <SelectItem value="daily">Daily</SelectItem>
      </SelectContent>
    </Select>
  );
}
