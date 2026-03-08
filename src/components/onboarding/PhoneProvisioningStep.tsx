import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Clock, CheckCircle } from "lucide-react";

interface Props {
  provisioningStatus: string;
  onFinish: () => void;
  onBack: () => void;
  loading?: boolean;
}

const PhoneProvisioningStep = ({ provisioningStatus, onFinish, onBack, loading }: Props) => {
  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            {provisioningStatus === "ready" ? (
              <CheckCircle className="w-12 h-12 text-primary" />
            ) : (
              <Phone className="w-12 h-12 text-primary" />
            )}
          </div>

          {provisioningStatus === "ready" ? (
            <>
              <h3 className="text-lg font-semibold">Your Number is Ready!</h3>
              <p className="text-sm text-muted-foreground">
                Your dedicated AI phone number has been provisioned and is ready to take calls.
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold">Phone Number Provisioning</h3>
              <p className="text-sm text-muted-foreground">
                Your dedicated phone number will be provisioned shortly. Our team will set it up
                and connect it to your AI agent.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Typically ready within 24 hours</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        We'll send you an email when your number is ready. You can also check back here anytime.
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onFinish} className="flex-1" disabled={loading}>
          {loading ? "Saving..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
};

export default PhoneProvisioningStep;
