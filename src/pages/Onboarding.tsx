import { useState, useEffect } from "react";
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
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Welcome", "Business", "Hours", "Agent", "Phone"];

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

  // Pre-fill company name from registration metadata
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      const companyName = user?.user_metadata?.company_name || "";
      if (companyName) {
        setProfile((prev) => ({ ...prev, businessName: companyName }));
      }
    });
  }, []);

  const [hours, setHours] = useState<BusinessHoursData>(defaultSchedule());
  const [voicemailEnabled, setVoicemailEnabled] = useState(true);

  const [agentConfig, setAgentConfig] = useState<AgentConfigData>({
    greetingMessage: "",
    faqEntries: [],
    preferredVoice: "professional-female",
  });

  // Saves onboarding data, notifies admin, returns the new record ID (or null on error)
  const handleFinish = async (): Promise<string | null> => {
    setSaving(true);
    try {
      // Get current user if logged in
      const { data: { user } } = await supabase.auth.getUser();

      const { data: inserted, error } = await supabase
        .from("customer_onboarding")
        .insert({
          business_name: profile.businessName,
          business_hours: hours as any,
          greeting_message: agentConfig.greetingMessage,
          services_offered: profile.servicesOffered,
          faq_entries: agentConfig.faqEntries as any,
          voicemail_enabled: voicemailEnabled,
          preferred_voice: agentConfig.preferredVoice,
          ...(user ? { user_id: user.id } : {}),
        } as any)
        .select("id")
        .single();

      if (error) throw error;

      // Notify admin (non-critical)
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

      return (inserted as any)?.id || null;
    } catch (err: any) {
      toast({ title: "Error saving", description: err.message, variant: "destructive" });
      return null;
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
                  {step === 1 && "Welcome"}
                  {step === 2 && "Business Profile"}
                  {step === 3 && "Business Hours"}
                  {step === 4 && "AI Agent Configuration"}
                  {step === 5 && "Phone Number"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {step === 1 && (
                  <WelcomeStep onNext={() => setStep(2)} />
                )}
                {step === 2 && (
                  <BusinessProfileStep data={profile} onChange={setProfile} onNext={() => setStep(3)} />
                )}
                {step === 3 && (
                  <BusinessHoursStep
                    data={hours}
                    voicemailEnabled={voicemailEnabled}
                    onChange={setHours}
                    onVoicemailChange={setVoicemailEnabled}
                    onNext={() => setStep(4)}
                    onBack={() => setStep(2)}
                  />
                )}
                {step === 4 && (
                  <AgentConfigStep
                    data={agentConfig}
                    onChange={setAgentConfig}
                    onNext={() => setStep(5)}
                    onBack={() => setStep(3)}
                  />
                )}
                {step === 5 && (
                  <PhoneProvisioningStep
                    provisioningStatus="pending"
                    onFinish={handleFinish}
                    onBack={() => setStep(4)}
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
