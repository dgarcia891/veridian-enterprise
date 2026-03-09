import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect, useRef } from "react";
import { RetellVoiceWidget } from "@/components/RetellVoiceWidget";
import { RetellChatInterface } from "@/components/RetellChatInterface";
import ScrollToTop from "@/components/ScrollToTop";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useFocusOnRouteChange } from "@/hooks/useFocusOnRouteChange";

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
const BlogPost = lazy(() => import("./pages/BlogPost"));
const BlogAdmin = lazy(() => import("./pages/admin/BlogAdmin"));
const BlogPostForm = lazy(() => import("./pages/admin/BlogPostForm"));
const AdminAuth = lazy(() => import("./pages/admin/AdminAuth"));
const AIAgentDemos = lazy(() => import("./pages/AIAgentDemos"));
const SunsetOnLyons = lazy(() => import("./pages/demos/SunsetOnLyons"));
const MedicalOffice = lazy(() => import("./pages/demos/MedicalOffice"));
const AIInsightReport = lazy(() => import("./pages/AIInsightReport"));
const SiteContent = lazy(() => import("./pages/SiteContent"));
const Restaurants = lazy(() => import("./pages/Restaurants"));
const Plumbers = lazy(() => import("./pages/Plumbers"));
const OptIn = lazy(() => import("./pages/OptIn"));
const Qualification = lazy(() => import("./pages/Qualification"));
const AIAudit = lazy(() => import("./pages/AIAudit"));
const RoofingAudit = lazy(() => import("./pages/RoofingAudit"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Consultation = lazy(() => import("./pages/Consultation"));
const SMSOptInGuide = lazy(() => import("./pages/SMSOptInGuide"));
const Analytics = lazy(() => import("./pages/admin/Analytics"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const LeadsDashboard = lazy(() => import("./pages/admin/LeadsDashboard"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const VsSmithAI = lazy(() => import("./pages/compare/VsSmithAI"));
const VsMyAIFrontDesk = lazy(() => import("./pages/compare/VsMyAIFrontDesk"));
const VsDialzara = lazy(() => import("./pages/compare/VsDialzara"));
const VsRubyReceptionists = lazy(() => import("./pages/compare/VsRubyReceptionists"));
const VsMoneypenny = lazy(() => import("./pages/compare/VsMoneypenny"));
const VsAnswering360 = lazy(() => import("./pages/compare/VsAnswering360"));
const VsPATLive = lazy(() => import("./pages/compare/VsPATLive"));
const Compare = lazy(() => import("./pages/compare/Compare"));
const HVAC = lazy(() => import("./pages/HVAC"));
const Electricians = lazy(() => import("./pages/Electricians"));
const LawFirms = lazy(() => import("./pages/LawFirms"));
const MedicalOffices = lazy(() => import("./pages/MedicalOffices"));
const Signup = lazy(() => import("./pages/Signup"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const CustomerLogin = lazy(() => import("./pages/customer/Login"));
const CustomerRegister = lazy(() => import("./pages/customer/Register"));
const ForgotPassword = lazy(() => import("./pages/customer/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/customer/ResetPassword"));
const CustomerDashboard = lazy(() => import("./pages/customer/Dashboard"));

const queryClient = new QueryClient();

export const AppContent = () => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const lastTrackedPath = useRef<string | null>(null);

  // Focus management for screen reader users on route changes (WCAG 2.1 AA)
  useFocusOnRouteChange();

  useEffect(() => {
    // GA4 records the initial page_view from gtag('config'). Track SPA route changes after that.
    if (lastTrackedPath.current === null) {
      lastTrackedPath.current = location.pathname;
      return;
    }

    trackPageView();
    lastTrackedPath.current = location.pathname;
  }, [location.pathname, trackPageView]);

  const isDemoPage = location.pathname.startsWith('/demos/');
  const isAIInsightPage = location.pathname === '/ai-insight';

  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/ai-receptionist" element={<AIReceptionist />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
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
          <Route path="/signup" element={<Signup />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/customer/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
          <Route path="/consultation-booked" element={<ConsultationBooked />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<AdminAuth />} />
          <Route path="/admin/blog" element={<BlogAdmin />} />
          <Route path="/admin/blog/new" element={<BlogPostForm />} />
          <Route path="/admin/blog/edit/:id" element={<BlogPostForm />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/leads" element={<LeadsDashboard />} />

          <Route path="/demos/ai-agent-demos" element={<AIAgentDemos />} />
          <Route path="/demos/sunset-on-lyons" element={<SunsetOnLyons />} />
          <Route path="/demos/medical-office" element={<MedicalOffice />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/plumbers" element={<Plumbers />} />
          <Route path="/hvac" element={<HVAC />} />
          <Route path="/electricians" element={<Electricians />} />
          <Route path="/law-firms" element={<LawFirms />} />
          <Route path="/medical-offices" element={<MedicalOffices />} />
          <Route path="/ai-insight" element={<AIInsightReport />} />
          <Route path="/site-content" element={<SiteContent />} />
          <Route path="/opt-in" element={<OptIn />} />
          <Route path="/qualification" element={<Qualification />} />
          <Route path="/sms-opt-in-guide" element={<SMSOptInGuide />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/compare/vs-smith-ai" element={<VsSmithAI />} />
          <Route path="/compare/vs-my-ai-front-desk" element={<VsMyAIFrontDesk />} />
          <Route path="/compare/vs-dialzara" element={<VsDialzara />} />
          <Route path="/compare/vs-ruby-receptionists" element={<VsRubyReceptionists />} />
          <Route path="/compare/vs-moneypenny" element={<VsMoneypenny />} />
          <Route path="/compare/vs-answering360" element={<VsAnswering360 />} />
          <Route path="/compare/vs-patlive" element={<VsPATLive />} />
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
        <ScrollToTop />
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
