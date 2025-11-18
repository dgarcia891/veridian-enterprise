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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PlanSelectionFormProps {
  control: Control<any>;
}

const PLANS = [
  {
    id: "annual",
    value: "annual",
    title: "Annual Plan (Most Popular)",
    price: "$500",
    billing: "Billed $6,000/year",
    savings: "Save $6,000/year",
  },
  {
    id: "monthly",
    value: "monthly",
    title: "Monthly Plan",
    price: "$1,000",
    billing: "Billed monthly",
    setupFee: "+ $450 setup fee",
  },
  {
    id: "medical",
    value: "medical",
    title: "Medical/Healthcare Plan",
    price: "$2,000",
    billing: "Billed $24,000/year",
    hipaa: "HIPAA-compliant**",
  },
];

export const PlanSelectionForm = memo(({ control }: PlanSelectionFormProps) => {
  return (
    <FormField
      control={control}
      name="planType"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Select Your Plan *</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid md:grid-cols-3 gap-4"
            >
              {PLANS.map((plan) => (
                <label
                  key={plan.id}
                  htmlFor={plan.id}
                  className={`flex items-center space-x-2 border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    field.value === plan.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <RadioGroupItem value={plan.value} id={plan.id} />
                  <div className="flex-1">
                    <div className="font-semibold">{plan.title}</div>
                    <div className="text-2xl font-bold mt-1">
                      {plan.price}
                      <span className="text-base font-normal">/month</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{plan.billing}</div>
                    {plan.savings && (
                      <div className="text-sm text-primary font-semibold mt-2">
                        {plan.savings}
                      </div>
                    )}
                    {plan.setupFee && (
                      <div className="text-sm text-destructive font-semibold mt-2">
                        {plan.setupFee}
                      </div>
                    )}
                    {plan.hipaa && (
                      <div className="text-sm text-primary font-semibold mt-2">
                        {plan.hipaa}
                      </div>
                    )}
                  </div>
                </label>
              ))}
          </RadioGroup>
        </FormControl>
        {field.value === "medical" && (
          <FormDescription className="text-xs">
            HIPAA compliance available with Medical/Healthcare plan - includes Business Associate Agreement (BAA) and enhanced security protocols
          </FormDescription>
        )}
        <FormMessage />
        </FormItem>
      )}
    />
  );
});

PlanSelectionForm.displayName = "PlanSelectionForm";
