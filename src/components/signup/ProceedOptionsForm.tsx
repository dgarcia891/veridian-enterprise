import { memo } from "react";
import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Phone } from "lucide-react";

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
            <RadioGroup
              onValueChange={(value) => field.onChange(value === "true")}
              value={field.value ? "true" : "false"}
              className="space-y-3"
            >
              <label
                htmlFor="pay-now"
                className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  !field.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="false" id="pay-now" className="mt-1" />
                <div className="flex-1">
                  <div className="font-semibold">Sign Up Now & Pay</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Complete payment now, then schedule your setup appointment
                  </div>
                </div>
              </label>

              <label
                htmlFor="call-first"
                className={`flex items-start space-x-3 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  field.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value="true" id="call-first" className="mt-1" />
                <div className="flex-1">
                  <div className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Schedule a Call First
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Talk to our team before committing - we'll answer questions and help you get started
                  </div>
                </div>
              </label>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

ProceedOptionsForm.displayName = "ProceedOptionsForm";
