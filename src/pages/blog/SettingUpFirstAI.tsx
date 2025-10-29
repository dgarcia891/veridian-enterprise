import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, CheckCircle, Clock, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const SettingUpFirstAI = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-8 font-semibold"
          >
            <ArrowLeft size={20} /> Back to Blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                Tutorial
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                Feb 28, 2024
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                8 min read
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Setting Up Your First AI Voice Agent: A Complete Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Step-by-step instructions for getting your AI receptionist up and running in under 10 minutes.
            </p>
          </div>

          <div className="mb-12 rounded-2xl overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop"
              alt="Setting up AI voice agent"
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              Setting up an AI receptionist might sound complicated, but it's actually simpler than you think. In this comprehensive guide, we'll walk you through every step of the process to get your AI voice agent answering calls in less time than it takes to have a coffee break.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Before You Begin: Pre-Setup Checklist</h2>
            <p className="mb-4">
              Before diving into setup, make sure you have these items ready:
            </p>
            <ul className="space-y-2 mb-8">
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>Your business phone number (or decide if you want a new dedicated number)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>Access to your calendar system (Google Calendar, Outlook, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>A list of your most frequently asked questions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>Your business hours and scheduling preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="text-primary mt-1 flex-shrink-0" size={20} />
                <span>A list of services or products customers typically call about</span>
              </li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6">Step 1: Create Your Account and Configure Basics (2 minutes)</h2>
            <p className="mb-4">
              Start by signing up for AI Agents 3000. You'll need to provide:
            </p>
            <ol className="list-decimal pl-6 space-y-2 mb-6">
              <li><strong>Business Information:</strong> Your company name, industry, and primary business type</li>
              <li><strong>Phone Setup:</strong> Choose to forward your existing number or get a new dedicated AI line</li>
              <li><strong>Operating Hours:</strong> Set when your AI should answer calls (or choose 24/7)</li>
            </ol>
            <p className="mb-8">
              The system will automatically configure the basic voice settings based on your industry. For example, a medical office gets a calm, professional voice, while a restaurant gets a friendly, upbeat tone.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Step 2: Train Your AI with Business Knowledge (3 minutes)</h2>
            <p className="mb-4">
              This is where your AI becomes truly yours. The training wizard will guide you through:
            </p>
            <div className="bg-muted/50 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Essential Training Inputs:</h3>
              <ul className="space-y-3">
                <li><strong>Services/Products:</strong> Enter what you offer with brief descriptions</li>
                <li><strong>Pricing Information:</strong> Add your pricing (or set it to "contact for quote")</li>
                <li><strong>FAQs:</strong> The system suggests common questions based on your industry - approve or customize</li>
                <li><strong>Policies:</strong> Cancellation policies, payment terms, service areas, etc.</li>
                <li><strong>Special Instructions:</strong> Anything unique about how you want calls handled</li>
              </ul>
            </div>
            <p className="mb-8">
              <strong>Pro Tip:</strong> Don't overthink this step. You can always add more information later, and the AI learns from actual calls too.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Step 3: Connect Your Calendar and Tools (3 minutes)</h2>
            <p className="mb-4">
              Now it's time to enable the AI to take action:
            </p>
            <ol className="list-decimal pl-6 space-y-4 mb-8">
              <li>
                <strong>Calendar Integration:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Click "Connect Calendar" and choose your provider</li>
                  <li>Grant permission to view availability and create appointments</li>
                  <li>Set buffer times between appointments</li>
                  <li>Define appointment types and durations</li>
                </ul>
              </li>
              <li>
                <strong>CRM Integration (Optional):</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Connect to systems like Salesforce, HubSpot, or your booking software</li>
                  <li>The AI will automatically log all interactions</li>
                </ul>
              </li>
              <li>
                <strong>Notification Preferences:</strong>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Choose how you want to be notified (email, SMS, or both)</li>
                  <li>Set up urgent call protocols for specific situations</li>
                </ul>
              </li>
            </ol>

            <h2 className="text-3xl font-bold mt-12 mb-6">Step 4: Test Everything (2 minutes)</h2>
            <p className="mb-4">
              Before going live, test your setup thoroughly:
            </p>
            <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl mb-8">
              <h3 className="text-xl font-bold mb-4">Testing Checklist:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Call your number and go through a typical customer scenario</li>
                <li>Try booking an appointment - verify it appears in your calendar</li>
                <li>Ask common questions - make sure answers are accurate</li>
                <li>Test the transfer-to-human feature to ensure it works</li>
                <li>Check that you receive notifications as configured</li>
              </ol>
            </div>
            <p className="mb-8">
              If something doesn't sound right, you can adjust the voice personality, speaking speed, or any other settings in the dashboard. Most users tweak things 2-3 times before they're completely satisfied.
            </p>

            <h2 className="text-3xl font-bold mt-12 mb-6">Going Live and What to Expect</h2>
            <p className="mb-4">
              Once you're happy with testing, flip the switch to "Live" mode. Here's what typically happens:
            </p>
            <ul className="space-y-3 mb-8">
              <li><strong>First Week:</strong> The AI will handle 85-90% of calls perfectly. Review the 10-15% it transfers to see if you need to add more training data.</li>
              <li><strong>Second Week:</strong> Performance improves to 92-95% as the AI learns from corrections you make.</li>
              <li><strong>Month Two:</strong> Most businesses report 95%+ successful call handling without human intervention.</li>
            </ul>

            <h2 className="text-3xl font-bold mt-12 mb-6">Troubleshooting Common Setup Issues</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-2">Issue: AI doesn't understand specific industry terms</h3>
                <p><strong>Solution:</strong> Add those terms to the "Custom Vocabulary" section in settings with pronunciation guides if needed.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Issue: Calendar appointments not syncing</h3>
                <p><strong>Solution:</strong> Re-authenticate your calendar connection and ensure the AI has "write" permissions, not just "read."</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Issue: Voice sounds too robotic</h3>
                <p><strong>Solution:</strong> Switch to the "Natural" voice model in settings (uses more advanced AI) and adjust the speaking speed to 0.9x.</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">Issue: Too many calls being transferred to humans</h3>
                <p><strong>Solution:</strong> Review the call transcripts to identify patterns in questions the AI struggles with, then add that information to the knowledge base.</p>
              </div>
            </div>

            <h2 className="text-3xl font-bold mt-12 mb-6">Next Steps: Optimizing Your AI</h2>
            <p className="mb-4">
              After your first week, consider these advanced optimizations:
            </p>
            <ul className="space-y-2 mb-8">
              <li><strong>Call Flow Analysis:</strong> Review which questions are asked most and make sure those answers are prominently in your AI's knowledge base</li>
              <li><strong>Multi-language Support:</strong> If you get calls in other languages, enable those language models (takes 1 minute)</li>
              <li><strong>Smart Routing:</strong> Set up rules to route specific call types to specific team members</li>
              <li><strong>Custom Greetings:</strong> Create different greetings for different times of day or caller types</li>
            </ul>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-8 rounded-2xl border border-primary/20 mt-12">
              <h2 className="text-2xl font-bold mb-4">The Bottom Line</h2>
              <p className="text-lg mb-0">
                Setting up an AI voice agent is simpler than most people expect. With just 10 minutes of focused setup time, you can have a 24/7 receptionist that never misses a call, never takes a sick day, and gets smarter every day. Most business owners wish they'd done it sooner.
              </p>
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold mb-6 text-center">Ready to Get Started?</h2>
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                See how much revenue you're losing from missed calls, or schedule a free demo to see the setup process in action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/lost-revenue-calculator"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Calculate Lost Revenue
                </Link>
                <Link
                  to="/schedule-consultation"
                  className="inline-flex items-center justify-center glass-button px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Schedule Free Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default SettingUpFirstAI;
