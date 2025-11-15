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
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={!field.value ? "default" : "outline"}
                className="h-auto py-6 px-4 flex-col items-start text-left"
                onClick={() => field.onChange(false)}
              >
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <CreditCard className="h-4 w-4" />
                  Sign Up Now & Pay
                </div>
                <div className="text-xs font-normal opacity-90">
                  Complete payment now, then schedule your setup appointment
                </div>
              </Button>

              <Button
                type="button"
                variant={field.value ? "default" : "outline"}
                className="h-auto py-6 px-4 flex-col items-start text-left"
                onClick={() => field.onChange(true)}
              >
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <Phone className="h-4 w-4" />
                  Schedule a Call First
                </div>
                <div className="text-xs font-normal opacity-90">
                  Talk to our team before committing - we'll answer questions and help you get started
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
