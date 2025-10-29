import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollToTop from "@/components/ScrollToTop";

const Index = lazy(() => import("./pages/Index"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
const AIReceptionist = lazy(() => import("./pages/AIReceptionist"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const About = lazy(() => import("./pages/About"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const LostRevenueCalculator = lazy(() => import("./pages/LostRevenueCalculator"));
const Features = lazy(() => import("./pages/Features"));
const Signup = lazy(() => import("./pages/Signup"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-foreground text-lg">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<ROICalculator />} />
            <Route path="/ai-receptionist" element={<AIReceptionist />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/transforming-customer-service" element={<TransformingCustomerService />} />
            <Route path="/blog/roi-of-voice-ai" element={<ROIOfVoiceAI />} />
            <Route path="/blog/signs-you-need-ai" element={<SignsYouNeedAI />} />
            <Route path="/blog/setting-up-first-ai" element={<SettingUpFirstAI />} />
            <Route path="/blog/why-local-businesses-switching" element={<WhyLocalBusinesses />} />
            <Route path="/blog/future-of-communication" element={<FutureOfCommunication />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/lost-revenue-calculator" element={<LostRevenueCalculator />} />
            <Route path="/features" element={<Features />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
            <Route path="/consultation-booked" element={<ConsultationBooked />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
