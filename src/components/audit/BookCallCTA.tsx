import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";

interface BookCallCTAProps {
  businessName: string;
  phone: string;
  lostRevenueLow: number;
  lostRevenueHigh: number;
}

const BookCallCTA = ({ businessName, phone, lostRevenueLow, lostRevenueHigh }: BookCallCTAProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Load GHL form embed script
  useEffect(() => {
    if (isCalendarOpen) {
      const script = document.createElement('script');
      script.src = 'https://link.msgsndr.com/js/form_embed.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isCalendarOpen]);

  const handleBookCallClick = () => {
    console.log('[Analytics] CTA Click: Book Strategy Call', {
      location: 'quick-results',
      businessName,
      lostRevenueRange: `${lostRevenueLow}-${lostRevenueHigh}`,
      timestamp: new Date().toISOString()
    });
    setIsCalendarOpen(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-primary/30 bg-card shadow-lg">
        <CardContent className="p-10 md:p-12 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Phone className="h-10 w-10 text-primary" />
          </div>

          {/* Headline */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Ready to Stop Losing Money?
          </h2>

          {/* Subtext */}
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Book a free 15-minute strategy call and see exactly how an AI receptionist 
            would work for <span className="font-semibold text-foreground">{businessName}</span>
          </p>

          {/* Primary CTA Button */}
          <Button
            size="lg"
            onClick={handleBookCallClick}
            className="w-full md:w-auto text-lg h-14 px-12 font-semibold group hover:scale-[1.02] hover:shadow-xl transition-all"
          >
            Schedule My Free Strategy Call
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-foreground/70 mt-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              No obligation
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Takes 15 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              See real demos
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Schedule My Free Strategy Call</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <iframe 
              src="https://api.leadconnectorhq.com/widget/booking/keoOUVa8k9FPAFUedUxS" 
              style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: '600px' }} 
              scrolling="no" 
              id="keoOUVa8k9FPAFUedUxS_1763689889122"
              title="Schedule Strategy Call"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookCallCTA;
