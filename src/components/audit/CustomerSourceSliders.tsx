import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CustomerSourceSlidersProps {
  value: { website: number; phone: number; other: number };
  onChange: (value: { website: number; phone: number; other: number }) => void;
  totalCustomers: number;
  variant: "option-a" | "option-b" | "option-c";
}

export const CustomerSourceSliders = ({ value, onChange, totalCustomers, variant }: CustomerSourceSlidersProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const calculateCustomerCounts = () => ({
    website: Math.round(totalCustomers * (localValue.website / 100)),
    phone: Math.round(totalCustomers * (localValue.phone / 100)),
    other: Math.round(totalCustomers * (localValue.other / 100)),
  });

  const counts = calculateCustomerCounts();
  const sum = localValue.website + localValue.phone + localValue.other;
  const isValid = sum === 100;

  // Option A: Visual Bar with Priority-Based Filling
  if (variant === "option-a") {
    const handleWebsiteChange = (newValue: number) => {
      const remaining = 100 - newValue;
      const phoneMax = Math.min(localValue.phone, remaining);
      const otherValue = remaining - phoneMax;
      
      const updated = {
        website: newValue,
        phone: phoneMax,
        other: otherValue,
      };
      
      setLocalValue(updated);
      onChange(updated);
    };

    const handlePhoneChange = (newValue: number) => {
      const maxPhone = 100 - localValue.website;
      const clampedPhone = Math.min(newValue, maxPhone);
      const otherValue = 100 - localValue.website - clampedPhone;
      
      const updated = {
        website: localValue.website,
        phone: clampedPhone,
        other: otherValue,
      };
      
      setLocalValue(updated);
      onChange(updated);
    };

    return (
      <div className="space-y-6">
        {/* Visual Bar Display */}
        <div className="space-y-3">
          <Label>Customer Source Split</Label>
          <div className="relative h-12 w-full rounded-lg overflow-hidden border-2 border-border flex">
            <div 
              className="bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-medium text-sm transition-all duration-300"
              style={{ width: `${localValue.website}%` }}
            >
              {localValue.website > 8 && `${localValue.website}%`}
            </div>
            <div 
              className="bg-green-500 dark:bg-green-600 flex items-center justify-center text-white font-medium text-sm transition-all duration-300"
              style={{ width: `${localValue.phone}%` }}
            >
              {localValue.phone > 8 && `${localValue.phone}%`}
            </div>
            <div 
              className="bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-white font-medium text-sm transition-all duration-300"
              style={{ width: `${localValue.other}%` }}
            >
              {localValue.other > 8 && `${localValue.other}%`}
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Website: ≈ {counts.website} customers</span>
            <span>Phone: ≈ {counts.phone} customers</span>
            <span>Other: ≈ {counts.other} customers</span>
          </div>
        </div>

        {/* Website Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              Website
            </Label>
            <span className="text-sm font-medium text-primary">{localValue.website}%</span>
          </div>
          <Slider
            value={[localValue.website]}
            onValueChange={(val) => handleWebsiteChange(val[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Phone Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" />
              Phone
            </Label>
            <span className="text-sm font-medium text-primary">{localValue.phone}%</span>
          </div>
          <Slider
            value={[localValue.phone]}
            onValueChange={(val) => handlePhoneChange(val[0])}
            min={0}
            max={100 - localValue.website}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">Max: {100 - localValue.website}% (after website)</p>
        </div>

        {/* Other (Auto-calculated) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500" />
              Other Sources
            </Label>
            <span className="text-sm font-medium text-primary">{localValue.other}%</span>
          </div>
          <div className="h-10 rounded-lg bg-muted flex items-center justify-center text-sm text-muted-foreground">
            Auto-calculated: {localValue.other}% remaining
          </div>
        </div>
      </div>
    );
  }

  // Option B: Two Sliders with Auto-Calculated Third
  if (variant === "option-b") {
    const maxPhone = 100 - localValue.website;
    
    const handleWebsiteChange = (newValue: number) => {
      const updated = {
        website: newValue,
        phone: Math.min(localValue.phone, 100 - newValue),
        other: 0,
      };
      updated.other = 100 - updated.website - updated.phone;
      setLocalValue(updated);
      onChange(updated);
    };

    const handlePhoneChange = (newValue: number) => {
      const updated = {
        ...localValue,
        phone: newValue,
        other: 100 - localValue.website - newValue,
      };
      setLocalValue(updated);
      onChange(updated);
    };

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Website %</Label>
            <span className="text-sm font-medium text-primary">{localValue.website}%</span>
          </div>
          <Slider
            value={[localValue.website]}
            onValueChange={(val) => handleWebsiteChange(val[0])}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">≈ {counts.website} customers</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Phone %</Label>
            <span className="text-sm font-medium text-primary">{localValue.phone}%</span>
          </div>
          <Slider
            value={[localValue.phone]}
            onValueChange={(val) => handlePhoneChange(val[0])}
            min={0}
            max={maxPhone}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">≈ {counts.phone} customers</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Other % (auto-calculated)</Label>
            <span className="text-sm font-medium text-muted-foreground">{localValue.other}%</span>
          </div>
          <div className="h-2 rounded-full bg-secondary relative overflow-hidden">
            <div 
              className="absolute h-full bg-muted-foreground/30 transition-all duration-200"
              style={{ width: `${localValue.other}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">≈ {counts.other} customers</p>
        </div>

        <div className="text-center p-3 rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-950">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">
            {localValue.website}% + {localValue.phone}% + {localValue.other}% = 100% ✓
          </p>
        </div>
      </div>
    );
  }

  // Option C: Visual Split Bar with Draggable Dividers
  if (variant === "option-c") {
    const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);
    const [leftDivider, setLeftDivider] = useState(localValue.website);
    const [rightDivider, setRightDivider] = useState(localValue.website + localValue.phone);

    useEffect(() => {
      setLeftDivider(localValue.website);
      setRightDivider(localValue.website + localValue.phone);
    }, [localValue]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percent = Math.round((x / rect.width) * 100);
      const clampedPercent = Math.max(0, Math.min(100, percent));

      if (isDragging === "left") {
        const newLeftDivider = Math.min(clampedPercent, rightDivider - 1);
        setLeftDivider(newLeftDivider);
        
        const updated = {
          website: newLeftDivider,
          phone: rightDivider - newLeftDivider,
          other: 100 - rightDivider,
        };
        setLocalValue(updated);
        onChange(updated);
      } else if (isDragging === "right") {
        const newRightDivider = Math.max(clampedPercent, leftDivider + 1);
        setRightDivider(newRightDivider);
        
        const updated = {
          website: leftDivider,
          phone: newRightDivider - leftDivider,
          other: 100 - newRightDivider,
        };
        setLocalValue(updated);
        onChange(updated);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
      }
    }, [isDragging]);

    return (
      <div className="space-y-4">
        <Label>Drag dividers to adjust split</Label>
        
        <div 
          className="relative h-16 rounded-lg overflow-hidden cursor-pointer select-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
        >
          {/* Website section */}
          <div 
            className="absolute h-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-medium transition-all duration-150"
            style={{ width: `${localValue.website}%`, left: 0 }}
          >
            <span className="text-sm">Website {localValue.website}%</span>
          </div>

          {/* Phone section */}
          <div 
            className="absolute h-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white font-medium transition-all duration-150"
            style={{ width: `${localValue.phone}%`, left: `${localValue.website}%` }}
          >
            <span className="text-sm">Phone {localValue.phone}%</span>
          </div>

          {/* Other section */}
          <div 
            className="absolute h-full bg-purple-500 dark:bg-purple-600 flex items-center justify-center text-white font-medium transition-all duration-150"
            style={{ width: `${localValue.other}%`, left: `${localValue.website + localValue.phone}%` }}
          >
            <span className="text-sm">Other {localValue.other}%</span>
          </div>

          {/* Left divider handle */}
          <div
            className="absolute top-0 h-full w-1 bg-white dark:bg-gray-900 cursor-col-resize z-10 hover:w-2 transition-all"
            style={{ left: `${localValue.website}%`, transform: 'translateX(-50%)' }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging("left");
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1 h-6 bg-gray-400 rounded-full" />
            </div>
          </div>

          {/* Right divider handle */}
          <div
            className="absolute top-0 h-full w-1 bg-white dark:bg-gray-900 cursor-col-resize z-10 hover:w-2 transition-all"
            style={{ left: `${localValue.website + localValue.phone}%`, transform: 'translateX(-50%)' }}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsDragging("right");
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center">
              <div className="w-1 h-6 bg-gray-400 rounded-full" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="p-2 rounded bg-blue-50 dark:bg-blue-950">
            <p className="font-medium text-blue-700 dark:text-blue-300">≈ {counts.website} customers</p>
            <p className="text-xs text-muted-foreground">from website</p>
          </div>
          <div className="p-2 rounded bg-green-50 dark:bg-green-950">
            <p className="font-medium text-green-700 dark:text-green-300">≈ {counts.phone} customers</p>
            <p className="text-xs text-muted-foreground">from phone</p>
          </div>
          <div className="p-2 rounded bg-purple-50 dark:bg-purple-950">
            <p className="font-medium text-purple-700 dark:text-purple-300">≈ {counts.other} customers</p>
            <p className="text-xs text-muted-foreground">from other</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
