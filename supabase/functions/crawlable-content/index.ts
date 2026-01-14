import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'text/html; charset=utf-8',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Receptionist ROI Calculator - Complete Site Content</title>
    <meta name="description" content="Calculate how much revenue your business loses from missed calls. See the real ROI of 24/7 AI receptionists vs human staff.">
</head>
<body>
    <h1>AI Receptionist ROI Calculator</h1>
    
    <section>
        <h2>The Problem: Lost Revenue from Missed Calls</h2>
        <p>Small and medium businesses lose an average of $126,000 annually from unanswered calls.</p>
        <ul>
            <li>85% of customers who reach voicemail won't call back</li>
            <li>62% will immediately contact a competitor</li>
            <li>After-hours calls represent 40% of all inbound calls</li>
            <li>Average missed call value: $250-500 in lost revenue</li>
        </ul>
        
        <h3>Real Business Impact</h3>
        <p>Every missed call is a missed opportunity. When potential customers can't reach you:</p>
        <ul>
            <li>They move on to competitors within minutes</li>
            <li>Your marketing investment goes to waste</li>
            <li>You lose high-intent customers ready to buy</li>
            <li>Your reputation suffers from poor accessibility</li>
        </ul>
    </section>
    
    <section>
        <h2>The Solution: AI Receptionists</h2>
        <p>24/7/365 AI-powered virtual receptionists that answer 100% of your calls instantly.</p>
        
        <h3>Key Benefits</h3>
        <ul>
            <li><strong>100% Call Answer Rate:</strong> Never miss another call, even during peak hours or after business hours</li>
            <li><strong>Instant Response Time:</strong> Answer calls in under 1 second - no hold times, no voicemail</li>
            <li><strong>24/7/365 Availability:</strong> Work around the clock, including weekends and holidays</li>
            <li><strong>Instant Lead Capture:</strong> Collect caller information and intent immediately</li>
            <li><strong>Automated Appointment Booking:</strong> Schedule appointments directly into your calendar</li>
            <li><strong>Order Taking:</strong> Process orders and capture all necessary details</li>
            <li><strong>Cost Savings:</strong> 70-80% less expensive than human receptionists</li>
            <li><strong>Consistent Quality:</strong> Perfect performance on every call, every time</li>
        </ul>
        
        <h3>How It Works</h3>
        <ol>
            <li><strong>Intelligent Call Routing:</strong> AI answers and understands caller intent using natural language processing</li>
            <li><strong>Context-Aware Responses:</strong> Provides relevant information based on your business and caller needs</li>
            <li><strong>Seamless Integration:</strong> Connects with your CRM, calendar, and business systems</li>
            <li><strong>Real-Time Updates:</strong> Instant notifications and summaries delivered to your team</li>
            <li><strong>Continuous Learning:</strong> Improves over time based on your business patterns</li>
        </ol>
    </section>
    
    <section>
        <h2>ROI Calculator</h2>
        <p>Calculate your potential return on investment from implementing an AI receptionist.</p>
        
        <h3>Understanding the Calculation</h3>
        <p>Our calculator estimates your revenue loss based on:</p>
        <ul>
            <li>Number of missed calls per day (1-10 calls)</li>
            <li>Average customer value ($100-5000)</li>
            <li>Industry-standard conversion rates (85% of missed calls don't call back)</li>
            <li>250 working days per year</li>
        </ul>
        
        <h3>Typical Results</h3>
        <p>Businesses typically see:</p>
        <ul>
            <li>20-40% increase in lead capture</li>
            <li>15-25% improvement in customer satisfaction</li>
            <li>$50,000-$200,000 in recovered annual revenue</li>
            <li>ROI of 300-500% in the first year</li>
        </ul>
    </section>
    
    <section>
        <h2>Business Growth with AI</h2>
        <p>Transform your customer communication with AI-powered solutions.</p>
        
        <h3>Scale Your Business</h3>
        <ul>
            <li><strong>Handle Unlimited Calls:</strong> No capacity constraints or busy signals</li>
            <li><strong>Support Growth:</strong> Scale instantly without hiring additional staff</li>
            <li><strong>Multi-Location Support:</strong> Manage calls across all your locations from one system</li>
            <li><strong>Analytics & Insights:</strong> Track call patterns, peak times, and customer needs</li>
        </ul>
        
        <h3>Competitive Advantage</h3>
        <ul>
            <li>Respond faster than competitors who rely on voicemail</li>
            <li>Capture calls when competitors are closed</li>
            <li>Provide consistent, professional service every time</li>
            <li>Convert more leads with immediate engagement</li>
        </ul>
    </section>
    
    <section>
        <h2>Industries Served</h2>
        <p>Our AI receptionist solutions are proven across multiple industries:</p>
        <ul>
            <li><strong>Healthcare:</strong> Patient scheduling, prescription refills, emergency routing</li>
            <li><strong>Legal Services:</strong> Client intake, consultation booking, case inquiries</li>
            <li><strong>Real Estate:</strong> Property inquiries, showing scheduling, lead qualification</li>
            <li><strong>Home Services:</strong> Service requests, emergency calls, appointment booking</li>
            <li><strong>Professional Services:</strong> Consultation scheduling, service inquiries, client management</li>
            <li><strong>Retail:</strong> Order taking, inventory checks, store information</li>
            <li><strong>Restaurants:</strong> Reservations, takeout orders, catering inquiries</li>
        </ul>
    </section>
    
    <section>
        <h2>Pricing & Plans</h2>
        <p>Flexible pricing options to match your business needs:</p>
        
        <h3>Starter Plan</h3>
        <ul>
            <li>Up to 500 calls per month</li>
            <li>Basic call answering and routing</li>
            <li>Lead capture</li>
            <li>Email notifications</li>
            <li>Starting at $297/month</li>
        </ul>
        
        <h3>Professional Plan</h3>
        <ul>
            <li>Up to 2000 calls per month</li>
            <li>Advanced call handling</li>
            <li>Appointment scheduling</li>
            <li>CRM integration</li>
            <li>Priority support</li>
            <li>Starting at $697/month</li>
        </ul>
        
        <h3>Enterprise Plan</h3>
        <ul>
            <li>Unlimited calls</li>
            <li>Custom integrations</li>
            <li>Multi-location support</li>
            <li>Dedicated account manager</li>
            <li>Advanced analytics</li>
            <li>Custom pricing</li>
        </ul>
    </section>
    
    <section>
        <h2>Frequently Asked Questions</h2>
        
        <h3>How realistic does the AI sound?</h3>
        <p>Our AI uses advanced natural language processing and voice synthesis to provide human-like conversations. Most callers cannot distinguish it from a human receptionist.</p>
        
        <h3>Can it handle complex inquiries?</h3>
        <p>Yes. The AI can handle complex multi-step conversations, transfer calls when needed, and escalate to human staff for specialized situations.</p>
        
        <h3>How long does setup take?</h3>
        <p>Most businesses are fully operational within 3-5 business days. We handle all technical setup and training.</p>
        
        <h3>What if the AI doesn't understand a caller?</h3>
        <p>The system can seamlessly transfer to a human team member or take a detailed message with all caller information.</p>
        
        <h3>Can I customize the responses?</h3>
        <p>Absolutely. We customize the AI to match your brand voice, policies, and specific business needs.</p>
        
        <h3>What integrations are supported?</h3>
        <p>We integrate with major CRM systems, calendars, and business tools including Salesforce, HubSpot, Google Calendar, and more.</p>
    </section>
    
    <section>
        <h2>Get Started Today</h2>
        <p>Stop losing $126,000 a year to missed calls. Start converting 100% of your calls into opportunities.</p>
        <p>Contact us to schedule a free consultation and see how AI receptionists can transform your business.</p>
        <p>Phone: 661-263-4388</p>
    </section>
    
    <footer>
        <p>&copy; 2024 AI Agent ROI Calculator. All rights reserved.</p>
    </footer>
</body>
</html>
    `;

    return new Response(html, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating crawlable content:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
