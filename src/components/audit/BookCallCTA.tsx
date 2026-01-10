import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, ArrowRight, CheckCircle2 } from "lucide-react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CALCOM_CONFIG, CALCOM_THEME } from "@/config/calcom";

interface BookCallCTAProps {
  businessName: string;
  phone: string;
  lostRevenueLow: number;
  lostRevenueHigh: number;
}

const BookCallCTA = ({ businessName, phone, lostRevenueLow, lostRevenueHigh }: BookCallCTAProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: CALCOM_THEME.theme,
        hideEventTypeDetails: CALCOM_THEME.hideEventTypeDetails,
        layout: CALCOM_THEME.layout,
      });
    })();
  }, []);

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
        <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Schedule My Free Strategy Call</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <Cal
              calLink={CALCOM_CONFIG.bookingLink}
              style={{ width: "100%", height: "100%", minHeight: "500px" }}
              config={{
                theme: CALCOM_THEME.theme,
                layout: CALCOM_THEME.layout,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookCallCTA;
