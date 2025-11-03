import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaywallOverlayProps {
  onUnlockClick: () => void;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({ onUnlockClick }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm rounded-3xl z-10">
      <div className="max-w-md mx-4 glass-card rounded-3xl p-8 text-center shadow-2xl">
        <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3">Unlock Your Complete Report</h3>
        
        <div className="space-y-2 mb-6 text-left">
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>All 5 AI opportunities</strong> tailored to your industry
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Complete ROI breakdown</strong> with financial projections
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>3 ready-to-use outreach templates</strong> for your sales team
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong>Downloadable PDF report</strong> to share with your team
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={onUnlockClick}
            size="lg"
            className="w-full text-lg py-6 rounded-xl"
          >
            Unlock Full Report – $9.99
          </Button>
          <p className="text-xs text-muted-foreground">
            Secure payment via Stripe • One-time purchase
          </p>
        </div>
      </div>
    </div>
  );
};
