import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SignsYouNeedAI = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            Back to Blog
          </Link>

          {/* Hero */}
          <div className="mb-12">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              Best Practices
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              5 Signs Your Business Needs an AI Receptionist
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                March 5, 2024
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                4 min read
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-12 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&auto=format&fit=crop"
              alt="Business Phone System"
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              Not every business needs an AI receptionist – but if you're experiencing any of these five signs, you're leaving money on the table every single day. Let's identify whether your business could benefit from automated phone answering.
            </p>

            <div className="bg-primary/10 border-l-4 border-primary p-6 rounded-r-lg mb-12">
              <p className="text-sm font-semibold mb-2">Quick Self-Assessment</p>
              <p className="text-sm">
                If three or more of these signs apply to your business, implementing an AI receptionist could increase your revenue by 20-40% within the first quarter.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">1</span>
              You're Missing Calls Regularly
            </h2>
            <p className="mb-6">
              This is the most obvious sign. If you regularly see missed calls on your phone system, you're losing business. Here's what's happening:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Lunch breaks result in 3-5 missed calls daily</li>
              <li>When you're with a customer, other customers can't reach you</li>
              <li>After-hours calls go straight to voicemail</li>
              <li>Peak periods overwhelm your current capacity</li>
            </ul>
            <div className="bg-accent/50 p-6 rounded-lg mb-6">
              <p className="font-bold mb-2">Reality Check:</p>
              <p className="text-sm">
                If you're missing even 5 calls per week, that's 260 missed opportunities per year. At a conservative 20% conversion rate with $1,000 average value, you're losing $52,000 annually.
              </p>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">2</span>
              Your Staff Is Overwhelmed with Phone Duties
            </h2>
            <p className="mb-6">
              Your team is skilled at what they do – but answering phones isn't their primary job. Signs this is a problem:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Staff complains about constant phone interruptions</li>
              <li>Work quality suffers because of call handling</li>
              <li>Phone duty rotates and everyone dreads it</li>
              <li>Technical staff spending time on basic scheduling</li>
            </ul>
            <p className="mb-6">
              <strong>The Hidden Cost:</strong> If a $25/hour technician spends 2 hours daily on phones, that's $13,000 per year in wasted skilled labor. Plus, the opportunity cost of work not being done is even higher.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">3</span>
              You Can't Afford 24/7 Coverage (But Need It)
            </h2>
            <p className="mb-6">
              Your customers call outside business hours, but hiring staff for evenings and weekends isn't financially viable. This applies to:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Emergency Services:</strong> Plumbing, HVAC, locksmith businesses</li>
              <li><strong>Healthcare:</strong> Dental offices, medical practices</li>
              <li><strong>Food Service:</strong> Restaurants with reservation systems</li>
              <li><strong>Any Business:</strong> Competing for customers who call evenings/weekends</li>
            </ul>
            <div className="bg-accent/50 p-6 rounded-lg mb-6">
              <p className="font-bold mb-2">Case Study:</p>
              <p className="text-sm mb-2">
                A plumbing company implemented AI reception to handle after-hours emergency calls. Results:
              </p>
              <ul className="text-sm space-y-1 pl-4">
                <li>• Captured 40 emergency calls first month</li>
                <li>• Average job value: $850</li>
                <li>• Revenue from previously missed calls: $34,000</li>
                <li>• AI cost: $500/month</li>
                <li>• ROI: 6,700%</li>
              </ul>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">4</span>
              High Receptionist Turnover or Hiring Challenges
            </h2>
            <p className="mb-6">
              The receptionist position is notoriously difficult to fill and maintain. Common problems:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Constant recruitment and training cycles</li>
              <li>Coverage gaps during transitions</li>
              <li>Rising wages making the position expensive</li>
              <li>Quality candidates hard to find</li>
            </ul>
            <p className="mb-6">
              <strong>The Math:</strong> Recruiting, hiring, and training a new receptionist costs $5,000-$8,000 and takes 2-3 months. If you're doing this every 18 months (typical turnover), you're spending $4,000-$5,300 annually just on turnover, plus the cost of gaps in coverage.
            </p>
            <p className="mb-6">
              An AI receptionist costs $3,600-$7,200 per year total, never quits, never needs training, and never takes a sick day.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6 flex items-center gap-3">
              <span className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold">5</span>
              Inconsistent Customer Experience
            </h2>
            <p className="mb-6">
              Your front desk experience varies based on who's answering. Red flags include:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Some staff members are better on phones than others</li>
              <li>New employees still learning your processes</li>
              <li>Busy periods result in rushed, poor service</li>
              <li>Information provided varies by who answers</li>
            </ul>
            <p className="mb-6">
              Inconsistent service damages your brand. One bad phone experience can lose a customer forever, and they'll tell others about it. AI receptionists deliver identical, professional service on every single call – no exceptions.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Bonus Sign: You're Growing Quickly</h2>
            <p className="mb-6">
              If your business is growing, your phone volume is increasing proportionally. The question is: does your call handling capability scale with your growth? Most businesses hit a wall where hiring another full-time receptionist isn't justified yet, but the current team is overwhelmed.
            </p>
            <p className="mb-6">
              AI reception scales infinitely. Whether you get 10 calls or 1,000 calls per day, the service quality and response time remain identical. Your growth never outpaces your phone capacity.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Taking Action</h2>
            <p className="mb-6">
              If you identified with any of these signs, you're experiencing real costs right now. These aren't theoretical problems – they're money leaving your business every single day.
            </p>
            <p className="mb-6">
              The good news? AI reception solves all five problems simultaneously:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <p>Never miss another call (24/7/365 availability)</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <p>Free up staff for their actual jobs</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <p>Provide after-hours coverage affordably</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <p>Eliminate turnover costs and gaps</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="text-primary mt-1 shrink-0" size={20} />
                <p>Deliver consistent, professional service every time</p>
              </div>
            </div>
            <p className="mb-6">
              Most businesses see positive ROI within their first month. The setup takes less than 10 minutes, there's no long-term commitment, and you can start capturing those missed calls today.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 glass-card p-8 rounded-2xl border border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="text-2xl font-bold mb-4">See If AI Reception Is Right for You</h3>
            <p className="text-muted-foreground mb-6">
              Calculate exactly how much revenue you're losing to missed calls and what an AI receptionist could mean for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/lost-revenue-calculator"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Calculate Lost Revenue
              </Link>
              <Link
                to="/schedule-consultation"
                className="inline-flex items-center justify-center glass-button px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default SignsYouNeedAI;
