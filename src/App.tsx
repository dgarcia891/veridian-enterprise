import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Index = lazy(() => import("./pages/Index"));
const ROICalculator = lazy(() => import("./pages/ROICalculator"));
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-foreground text-lg">Loading...</div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/roi-preview" element={<ROICalculator />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/lost-revenue-calculator" element={<LostRevenueCalculator />} />
            <Route path="/features" element={<Features />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/schedule-consultation" element={<ScheduleConsultation />} />
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
