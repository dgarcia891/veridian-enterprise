import { memo } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessDetailsFormProps {
  control: Control<any>;
}

const INDUSTRIES = [
  { value: "restaurant", label: "Restaurant & Food Service" },
  { value: "healthcare", label: "Healthcare & Medical" },
  { value: "retail", label: "Retail & E-commerce" },
  { value: "professional", label: "Professional Services" },
  { value: "home-services", label: "Home Services" },
  { value: "other", label: "Other" },
];

export const BusinessDetailsForm = memo(({ control }: BusinessDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Business Details (Optional)</h3>
      
      <FormField
        control={control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {INDUSTRIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="averageCallsPerDay"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Average Calls Per Day</FormLabel>
            <FormControl>
              <Input type="number" placeholder="50" {...field} />
            </FormControl>
            <FormDescription>
              Helps us understand your call volume
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="currentPhoneSystem"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Phone System</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us about your current setup (e.g., traditional phone line, VoIP system, etc.)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
});

BusinessDetailsForm.displayName = "BusinessDetailsForm";
