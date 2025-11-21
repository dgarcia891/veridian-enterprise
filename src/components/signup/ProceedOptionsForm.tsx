import { memo } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Phone, CreditCard } from "lucide-react";

interface ProceedOptionsFormProps {
  control: Control<any>;
}

export const ProceedOptionsForm = memo(({ control }: ProceedOptionsFormProps) => {
  return (
    <FormField
      control={control}
      name="wantsCallFirst"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>How would you like to proceed? *</FormLabel>
          <FormControl>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <Button
                type="button"
                variant={!field.value ? "default" : "outline"}
                className="h-auto py-4 md:py-6 px-4 flex-col items-start text-left"
                onClick={() => field.onChange(false)}
              >
                <div className="flex items-center gap-2 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                  <CreditCard className="h-4 w-4 flex-shrink-0" />
                  Get 100% Lead Capture Now
                </div>
                <div className="text-xs font-normal opacity-90">
                  Complete payment now, then schedule your setup appointment
                </div>
              </Button>

              <Button
                type="button"
                variant={field.value ? "default" : "outline"}
                className="h-auto py-4 md:py-6 px-4 flex-col items-start text-left"
                onClick={() => field.onChange(true)}
              >
                <div className="flex items-center gap-2 font-semibold mb-1 md:mb-2 text-sm md:text-base">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  Schedule a Consultation
                </div>
                <div className="text-xs font-normal opacity-90">
                  Talk to our team before committing
                </div>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

ProceedOptionsForm.displayName = "ProceedOptionsForm";
