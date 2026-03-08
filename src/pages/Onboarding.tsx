import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import BusinessProfileStep from "@/components/onboarding/BusinessProfileStep";
import BusinessHoursStep, { defaultSchedule, type BusinessHoursData } from "@/components/onboarding/BusinessHoursStep";
import AgentConfigStep, { type AgentConfigData } from "@/components/onboarding/AgentConfigStep";
import PhoneProvisioningStep from "@/components/onboarding/PhoneProvisioningStep";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Business", "Hours", "Agent", "Phone"];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    businessName: "",
    industry: "",
    servicesOffered: [] as string[],
  });

  const [hours, setHours] = useState<BusinessHoursData>(defaultSchedule());
  const [voicemailEnabled, setVoicemailEnabled] = useState(true);

  const [agentConfig, setAgentConfig] = useState<AgentConfigData>({
    greetingMessage: "",
    faqEntries: [],
    preferredVoice: "professional-female",
  });

  const handleFinish = async () => {
    setSaving(true);
    try {
      // Save onboarding data directly (no signup_id link for now — will be linked via admin)
      const { error } = await supabase.from("customer_onboarding").insert({
        business_name: profile.businessName,
        business_hours: hours,
        greeting_message: agentConfig.greetingMessage,
        services_offered: profile.servicesOffered,
        faq_entries: agentConfig.faqEntries,
        voicemail_enabled: voicemailEnabled,
        preferred_voice: agentConfig.preferredVoice,
      });

      if (error) throw error;

      // Notify admin
      try {
        await supabase.functions.invoke("notify-admin-email", {
          body: {
            notificationType: "new_signup",
            leadData: {
              businessName: profile.businessName,
              industry: profile.industry,
              services: profile.servicesOffered.join(", "),
              voice: agentConfig.preferredVoice,
              greeting: agentConfig.greetingMessage,
              faqCount: agentConfig.faqEntries.length,
            },
          },
        });
      } catch {
        // Non-critical
      }

      toast({ title: "Setup complete!", description: "We'll email you when your number is ready." });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Set Up Your AI Agent | AI Agents 3000</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-1 pt-24 pb-16">
          <div className="container max-w-2xl mx-auto px-4">
            <OnboardingProgress currentStep={step} steps={STEPS} />

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl">
                  {step === 1 && "Business Profile"}
                  {step === 2 && "Business Hours"}
                  {step === 3 && "AI Agent Configuration"}
                  {step === 4 && "Phone Number"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <BusinessProfileStep data={profile} onChange={setProfile} onNext={() => setStep(2)} />
                )}
                {step === 2 && (
                  <BusinessHoursStep
                    data={hours}
                    voicemailEnabled={voicemailEnabled}
                    onChange={setHours}
                    onVoicemailChange={setVoicemailEnabled}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <AgentConfigStep
                    data={agentConfig}
                    onChange={setAgentConfig}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                  />
                )}
                {step === 4 && (
                  <PhoneProvisioningStep
                    provisioningStatus="pending"
                    onFinish={handleFinish}
                    onBack={() => setStep(3)}
                    loading={saving}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Onboarding;
