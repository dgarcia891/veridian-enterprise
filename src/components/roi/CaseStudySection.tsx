import { CheckCircle, TrendingUp, Clock, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const CaseStudySection = () => {
  const navigate = useNavigate();
  const results = [{
    icon: CheckCircle,
    text: "100% automation of routine inquiries and scheduling"
  }, {
    icon: TrendingUp,
    text: "90% reduction in manual workload for administrative tasks"
  }, {
    icon: Clock,
    text: "Instant responses to customers, 24/7/365"
  }, {
    icon: Users,
    text: "Customer satisfaction rate increased by 47%"
  }, {
    icon: Zap,
    text: "Set new industry benchmark for innovation and efficiency"
  }];
  return <section id="case-study" className="py-20 px-4 sm:px-6 lg:px-8 scroll-mt-16 bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-12">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <span className="text-sm font-bold uppercase tracking-wide">Real Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            How <strong>SoCal Scoopers</strong> Achieved Benchmark Efficiency
          </h2>
          <p className="text-2xl sm:text-3xl font-bold text-primary">
            Automated <strong>100% of Scheduling</strong>
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-12">
          {/* PROBLEM (BEFORE AI) */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-destructive">1</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                The Problem: <strong>Drowning in Manual Work</strong>
              </h3>
            </div>

            <div className="space-y-4 pl-0 sm:pl-16">
              <p className="text-lg sm:text-xl text-muted-foreground">
                <strong>SoCal Scoopers was stuck.</strong>
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                Every call required a human. Every booking was manual.
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                Their team spent <strong>80% of time on routine tasks</strong>.
              </p>
              
              <p className="text-lg sm:text-xl text-foreground font-semibold">
                Zero time left for growth or strategy.
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                <strong>High operational costs.</strong> Constant interruptions. Missed opportunities.
              </p>
              
              <p className="text-lg sm:text-xl text-foreground font-semibold">
                The cost of staying manual was crushing their business.
              </p>
            </div>
          </div>

          {/* SOLUTION & MECHANISM */}
          <div className="space-y-6 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                The Solution: <strong>AI-Powered Automation</strong>
              </h3>
            </div>

            <div className="space-y-4 pl-0 sm:pl-16">
              <p className="text-lg sm:text-xl text-foreground font-semibold">
                <strong>SoCal Scoopers deployed a 24/7 AI Agent.</strong>
              </p>
              
              
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                The AI answers <strong>100% of calls</strong>. Instantly.
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground">
                It books appointments. It answers questions. It never sleeps.
              </p>
              
              <p className="text-lg sm:text-xl text-foreground font-semibold">
                <strong>Complete automation.</strong> Zero manual scheduling.
              </p>
            </div>
          </div>

          {/* RESULTS (AFTER AI) */}
          <div className="space-y-6 pt-8 border-t border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                The Results: <strong>Transformation Complete</strong>
              </h3>
            </div>

            <div className="space-y-4 pl-0 sm:pl-16">
              {results.map((result, index) => {
              const Icon = result.icon;
              return <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/50 hover:bg-background transition-all">
                    <div className="flex-shrink-0 mt-1">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-foreground">
                      {result.text}
                    </p>
                  </div>;
            })}
            </div>

            <div className="mt-8 pt-8 border-t border-border pl-0 sm:pl-16">
              <p className="text-xl sm:text-2xl font-bold text-primary mb-4">
                <strong>The Bottom Line:</strong>
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-3">
                SoCal Scoopers now operates <strong>benchmark efficiency</strong>.
              </p>
              
              <p className="text-lg sm:text-xl text-muted-foreground mb-3">
                Their team focuses on <strong>growth, not grunt work</strong>.
              </p>
              
              <p className="text-lg sm:text-xl text-foreground font-semibold">
                Customers get instant service. The business scales effortlessly.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-8 text-center border-t border-border">
            <p className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Ready to Achieve <strong>The Same Results?</strong>
            </p>
            
            <Button onClick={() => navigate("/signup")} size="lg" className="bg-primary text-primary-foreground rounded-full px-10 py-6 text-lg font-semibold hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto group">
              Get 100% Lead Capture Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No complex setup required • 60-Day Money Back Guarantee
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default CaseStudySection;