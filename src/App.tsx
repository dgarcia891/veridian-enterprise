import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RetellVoiceWidget } from "@/components/RetellVoiceWidget";
import { RetellChatInterface } from "@/components/RetellChatInterface";
import ScrollToTop from "@/components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const AIReceptionist = lazy(() => import("./pages/AIReceptionist"));
const Services = lazy(() => import("./pages/Services"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const About = lazy(() => import("./pages/About"));
const AboutCEO = lazy(() => import("./pages/AboutCEO"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const LostRevenueCalculator = lazy(() => import("./pages/LostRevenueCalculator"));
const Features = lazy(() => import("./pages/Features"));
const ScheduleConsultation = lazy(() => import("./pages/ScheduleConsultation"));
const ConsultationBooked = lazy(() => import("./pages/ConsultationBooked"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Blog = lazy(() => import("./pages/Blog"));
const TransformingCustomerService = lazy(() => import("./pages/blog/TransformingCustomerService"));
const ROIOfVoiceAI = lazy(() => import("./pages/blog/ROIOfVoiceAI"));
const SignsYouNeedAI = lazy(() => import("./pages/blog/SignsYouNeedAI"));
const SettingUpFirstAI = lazy(() => import("./pages/blog/SettingUpFirstAI"));
const WhyLocalBusinesses = lazy(() => import("./pages/blog/WhyLocalBusinesses"));
const FutureOfCommunication = lazy(() => import("./pages/blog/FutureOfCommunication"));
const AIAgentDemos = lazy(() => import("./pages/AIAgentDemos"));
const SunsetOnLyons = lazy(() => import("./pages/demos/SunsetOnLyons"));
const AIInsightReport = lazy(() => import("./pages/AIInsightReport"));
const SiteContent = lazy(() => import("./pages/SiteContent"));
const Restaurants = lazy(() => import("./pages/Restaurants"));
const OptIn = lazy(() => import("./pages/OptIn"));
const Qualification = lazy(() => import("./pages/Qualification"));
const AIAudit = lazy(() => import("./pages/AIAudit"));
const RoofingAudit = lazy(() => import("./pages/RoofingAudit"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Consultation = lazy(() => import("./pages/Consultation"));

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isDemoPage = location.pathname.startsWith('/demos/');
  const isAIInsightPage = location.pathname === '/ai-insight';

  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-receptionist" element={<AIReceptionist />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/abouttheceo" element={<AboutCEO />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/roi-calculator" element={<ROICalculator />} />
          <Route path="/lost-revenue-calculator" element={<LostRevenueCalculator />} />
          <Route path="/audit" element={<AIAudit />} />
          <Route path="/audit/roofing" element={<RoofingAudit />} />
          <Route path="/audit/calls" element={<RoofingAudit />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
          <Route path="/consultation-booked" element={<ConsultationBooked />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/roi-of-voice-ai" element={<ROIOfVoiceAI />} />
          <Route path="/blog/transforming-customer-service" element={<TransformingCustomerService />} />
          <Route path="/blog/why-local-businesses" element={<WhyLocalBusinesses />} />
          <Route path="/blog/signs-you-need-ai" element={<SignsYouNeedAI />} />
          <Route path="/blog/setting-up-first-ai" element={<SettingUpFirstAI />} />
          <Route path="/blog/future-of-communication" element={<FutureOfCommunication />} />
          <Route path="/demos/ai-agent-demos" element={<AIAgentDemos />} />
          <Route path="/demos/sunset-on-lyons" element={<SunsetOnLyons />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/ai-insight" element={<AIInsightReport />} />
          <Route path="/site-content" element={<SiteContent />} />
          <Route path="/opt-in" element={<OptIn />} />
          <Route path="/qualification" element={<Qualification />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Show chat widget on all pages except demos */}
      {!isDemoPage && (
        <RetellChatInterface 
          agentId="agent_2df66bc30b17e2cbf174bf2f3b"
          title={isAIInsightPage ? "AI Report Assistant" : "Chat with AI"}
          minimized={true}
        />
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
