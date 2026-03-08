import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Clock, CheckCircle, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  provisioningStatus: string;
  onFinish: () => Promise<string | null>;
  onBack: () => void;
  loading?: boolean;
}

const PhoneProvisioningStep = ({ provisioningStatus, onFinish, onBack, loading }: Props) => {
  const [provisioning, setProvisioning] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState(provisioningStatus);

  const handleComplete = async () => {
    setProvisioning(true);
    setError(null);

    try {
      // First save onboarding data and get the ID back
      const onboardingId = await onFinish();
      if (!onboardingId) {
        setProvisioning(false);
        return; // Error handled by parent
      }

      // Attempt to provision a number
      const { data, error: fnError } = await supabase.functions.invoke("provision-twilio-number", {
        body: { onboardingId },
      });

      if (fnError) throw fnError;

      if (data?.success) {
        setPhoneNumber(data.phoneNumber);
        setStatus("ready");
      } else {
        // Graceful fallback — provisioning failed but onboarding saved
        setError(data?.error || "Could not provision a number automatically.");
        setStatus("pending");
      }
    } catch (err: any) {
      setError(err.message || "Provisioning unavailable. We'll set it up manually.");
      setStatus("pending");
    } finally {
      setProvisioning(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            {status === "ready" ? (
              <CheckCircle className="w-12 h-12 text-primary" />
            ) : provisioning ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : error ? (
              <AlertTriangle className="w-12 h-12 text-destructive" />
            ) : (
              <Phone className="w-12 h-12 text-primary" />
            )}
          </div>

          {status === "ready" && phoneNumber ? (
            <>
              <h3 className="text-lg font-semibold">Your Number is Ready!</h3>
              <p className="text-2xl font-mono font-bold text-primary">{phoneNumber}</p>
              <p className="text-sm text-muted-foreground">
                Your dedicated AI phone number has been provisioned and is ready to take calls.
              </p>
            </>
          ) : provisioning ? (
            <>
              <h3 className="text-lg font-semibold">Provisioning Your Number…</h3>
              <p className="text-sm text-muted-foreground">
                We're purchasing and configuring a dedicated phone number for your AI agent. This usually takes a few seconds.
              </p>
            </>
          ) : error ? (
            <>
              <h3 className="text-lg font-semibold">Setup Saved Successfully</h3>
              <p className="text-sm text-muted-foreground">
                Your configuration has been saved. We couldn't auto-provision a number right now, but our team will set it up manually.
              </p>
              <p className="text-xs text-muted-foreground italic">{error}</p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Phone Number Provisioning</h3>
              <p className="text-sm text-muted-foreground">
                When you complete setup, we'll automatically provision a dedicated phone number for your AI agent.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Usually ready in seconds</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {status === "ready" ? (
        <p className="text-sm text-muted-foreground text-center">
          You're all set! Your AI agent is connected to the number above.
        </p>
      ) : !error && !provisioning ? (
        <p className="text-sm text-muted-foreground text-center">
          We'll also send you an email confirmation when everything is ready.
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1" disabled={provisioning}>
          Back
        </Button>
        {status === "ready" ? (
          <Button onClick={() => window.location.href = "/"} className="flex-1">
            Go to Dashboard
          </Button>
        ) : error ? (
          <Button onClick={() => window.location.href = "/"} className="flex-1">
            Done
          </Button>
        ) : (
          <Button onClick={handleComplete} className="flex-1" disabled={loading || provisioning}>
            {provisioning ? "Provisioning…" : loading ? "Saving…" : "Complete Setup"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PhoneProvisioningStep;
