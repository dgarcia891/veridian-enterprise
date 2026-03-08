import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const fullName = user?.user_metadata?.full_name || "";
      const firstName = fullName.split(" ")[0];
      setName(firstName || "there");
    });
  }, []);

  return (
    <div className="text-center py-8 space-y-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
        <Sparkles className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        Welcome, {name}! 🎉
      </h2>
      <p className="text-muted-foreground max-w-md mx-auto">
        You're just a few steps away from having your own AI receptionist.
        Let's set up your agent so it can start answering calls for your business.
      </p>
      <Button size="lg" onClick={onNext}>
        Let's Get Started
      </Button>
    </div>
  );
};

export default WelcomeStep;
