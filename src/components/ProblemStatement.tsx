import { AlertCircle, DollarSign, PhoneMissed } from "lucide-react";

const ProblemStatement = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-destructive/10 border-y border-destructive/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" aria-hidden="true" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              The Hidden Cost of Missed Calls
            </h2>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Every missed call is a lost customer, lost revenue, and lost opportunity for growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card p-8 rounded-2xl border border-destructive/20">
            <PhoneMissed className="w-12 h-12 text-destructive mb-4" aria-hidden="true" />
            <div className="text-4xl font-bold mb-2 text-destructive">37%</div>
            <div className="text-xl font-semibold mb-3">Average Missed Call Rate</div>
            <p className="text-muted-foreground leading-relaxed">
              Small businesses miss over a third of all incoming calls, especially during peak hours and after business hours.
            </p>
          </div>

          <div className="bg-card p-8 rounded-2xl border border-destructive/20">
            <DollarSign className="w-12 h-12 text-destructive mb-4" aria-hidden="true" />
            <div className="text-4xl font-bold mb-2 text-destructive">$1,200</div>
            <div className="text-xl font-semibold mb-3">Average Revenue Per Missed Call</div>
            <p className="text-muted-foreground leading-relaxed">
              For service businesses, each missed call represents an average lost opportunity of $1,200 in potential revenue.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-2xl font-semibold text-muted-foreground">
            Missing just 10 calls per week = <span className="text-destructive font-bold">$624,000</span> lost annually
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatement;
