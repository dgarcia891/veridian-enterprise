import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About AI Agents 3000 - Our Mission & Story | AI Voice Receptionist</title>
        <meta name="description" content="Learn about AI Agents 3000's mission to help local businesses capture every customer call with intelligent AI voice receptionist technology. Founded in 2020." />
        <link rel="canonical" href="https://veridian.lovable.app/about" />
        <meta property="og:title" content="About AI Agents 3000 - Our Mission & Story" />
        <meta property="og:description" content="Helping local businesses capture every customer call with intelligent AI voice receptionist technology since 2020." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://veridian.lovable.app/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About AI Agents 3000 - Our Mission & Story" />
        <meta name="twitter:description" content="Helping local businesses capture every customer call with intelligent AI voice receptionist technology since 2020." />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">About AI Agents 3000</h1>
        <p className="text-xl text-muted-foreground mb-16 text-center max-w-3xl mx-auto">
          Helping local businesses capture every customer call with intelligent Voice AI receptionist technology.
        </p>

        <section className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">
              At AI Agents 3000, we believe that every phone call represents an opportunity. Our mission is to ensure local businesses never miss another customer call by providing cutting-edge Voice AI receptionist technology that captures revenue 24/7.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-muted-foreground leading-relaxed max-w-4xl">
              We envision a world where no business loses money from unanswered calls. By making intelligent Voice AI accessible and affordable, we're helping local businesses compete with larger competitors and maximize every revenue opportunity.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card p-8 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Innovation</h3>
                <p className="text-muted-foreground">
                  We leverage cutting-edge AI technology to solve real business problems, making advanced voice AI accessible to businesses of all sizes.
                </p>
              </div>
              <div className="glass-card p-8 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Simplicity</h3>
                <p className="text-muted-foreground">
                  We believe powerful technology should be easy to use. Our 10-minute setup and month-to-month commitment prove it.
                </p>
              </div>
              <div className="glass-card p-8 rounded-lg border border-border hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Results</h3>
                <p className="text-muted-foreground">
                  We start every conversation by calculating your lost revenue, proving ROI before you ever spend a penny with us.
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-12 rounded-lg border border-border">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2020, AI Agents 3000 emerged from a simple observation: local businesses were losing thousands in revenue every week from unanswered phone calls. The technology existed to solve this, but it was expensive, complex, and inaccessible to most small businesses.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Our founders, experts in both AI technology and local business operations, saw an opportunity to democratize this technology. By creating templated solutions that could be deployed in minutes instead of months, we made enterprise-level Voice AI affordable for every business.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we serve local businesses across industries - from restaurants and florists to construction companies and car dealerships - helping them capture every customer call and maximize their revenue potential 24/7.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose AI Agents 3000</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rapid Deployment</h3>
                  <p className="text-muted-foreground">10-minute setup using proven templates customized for your industry.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Proven ROI</h3>
                  <p className="text-muted-foreground">One salvaged high-ticket call can cover the entire annual cost.*</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Long-Term Commitment</h3>
                  <p className="text-muted-foreground">Month-to-month service with the freedom to cancel anytime.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Future-Proof Technology</h3>
                  <p className="text-muted-foreground">Your AI agent gets smarter and more capable with every update.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat with Rosie CTA */}
          <div className="glass-card p-6 sm:p-8 rounded-lg border border-primary/50 text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Have Questions? Chat with Rosie</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Our AI assistant Rosie is here to answer your questions about our services, pricing, and how AI voice agents can help your business. Click the chat widget in the bottom right corner to get started.
            </p>
          </div>

          {/* Blog CTA */}
          <div className="glass-card p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold mb-4">Learn More About AI Voice Technology</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Explore our blog for insights, case studies, and best practices on implementing AI voice assistants in your business.
            </p>
            <Link 
              to="/blog"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
            >
              Visit Our Blog
            </Link>
          </div>

          {/* Location */}
          <div id="location" className="glass-card p-8 rounded-lg border border-border text-center">
            <h2 className="text-2xl font-bold mb-4">Our Location</h2>
            <p className="text-muted-foreground">
              23638 Lyons Ave #429<br />
              Newhall, CA 91321
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground max-w-4xl">
              * Based on annual subscription cost of $3,600 and assuming 85% of missed callers never call back, recovering just one call valued at approximately $4,235 or higher would cover the entire year. Alternatively, recovering 5 missed calls at $850 each, or 10 missed calls at $425 each would achieve the same result.
            </p>
          </div>
        </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default About;
