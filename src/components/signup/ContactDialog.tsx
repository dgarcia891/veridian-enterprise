import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ContactInfoForm } from "./ContactInfoForm";
import { BusinessDetailsForm } from "./BusinessDetailsForm";
import { ProceedOptionsForm } from "./ProceedOptionsForm";
import { Loader2 } from "lucide-react";

const dialogFormSchema = z.object({
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(20),
  industry: z.string().optional(),
  averageCallsPerDay: z.string().optional(),
  currentPhoneSystem: z.string().optional(),
  wantsCallFirst: z.boolean().default(false),
});

type DialogFormValues = z.infer<typeof dialogFormSchema>;

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: DialogFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const ContactDialog = ({ open, onOpenChange, onSubmit, isSubmitting }: ContactDialogProps) => {
  const form = useForm({
    resolver: zodResolver(dialogFormSchema),
    mode: "onTouched" as const,
    defaultValues: {
      contactName: "",
      email: "",
      phone: "",
      industry: "",
      averageCallsPerDay: "",
      currentPhoneSystem: "",
      wantsCallFirst: false,
    },
  });

  const handleSubmit = async (values: DialogFormValues) => {
    await onSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Information</DialogTitle>
          <DialogDescription>
            Please provide your contact details to continue with your purchase.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ProceedOptionsForm control={form.control} />
            
            <div className="border-t pt-6">
              <ContactInfoForm control={form.control} />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Business Details (Optional)</h3>
              <BusinessDetailsForm control={form.control} />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                form.watch("wantsCallFirst") ? "Schedule My Consultation" : "Continue to Payment"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
