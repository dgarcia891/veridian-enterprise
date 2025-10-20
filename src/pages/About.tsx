import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">About Veridian Enterprises LLC</h1>
        <p className="text-xl text-white/70 mb-16 text-center max-w-3xl mx-auto">
          Helping local businesses capture every customer call with intelligent Voice AI receptionist technology.
        </p>

        <section className="space-y-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-white/80 leading-relaxed max-w-4xl">
              At Veridian Enterprises LLC, we believe that every phone call represents an opportunity. Our mission is to ensure local businesses never miss another customer call by providing cutting-edge Voice AI receptionist technology that captures revenue 24/7.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-white/80 leading-relaxed max-w-4xl">
              We envision a world where no business loses money from unanswered calls. By making intelligent Voice AI accessible and affordable, we're helping local businesses compete with larger competitors and maximize every revenue opportunity.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Innovation</h3>
                <p className="text-white/70">
                  We leverage cutting-edge AI technology to solve real business problems, making advanced voice AI accessible to businesses of all sizes.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Simplicity</h3>
                <p className="text-white/70">
                  We believe powerful technology should be easy to use. Our 10-minute setup and month-to-month commitment prove it.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Results</h3>
                <p className="text-white/70">
                  We start every conversation by calculating your lost revenue, proving ROI before you ever spend a penny with us.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Founded in 2020, Veridian Enterprises LLC emerged from a simple observation: local businesses were losing thousands in revenue every week from unanswered phone calls. The technology existed to solve this, but it was expensive, complex, and inaccessible to most small businesses.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              Our founders, experts in both AI technology and local business operations, saw an opportunity to democratize this technology. By creating templated solutions that could be deployed in minutes instead of months, we made enterprise-level Voice AI affordable for every business.
            </p>
            <p className="text-white/80 leading-relaxed">
              Today, we serve local businesses across industries - from restaurants and florists to construction companies and car dealerships - helping them capture every customer call and maximize their revenue potential 24/7.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Veridian Enterprises LLC</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Rapid Deployment</h3>
                  <p className="text-white/70">10-minute setup using proven templates customized for your industry.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Proven ROI</h3>
                  <p className="text-white/70">One salvaged high-ticket call can cover the entire annual cost.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">No Long-Term Commitment</h3>
                  <p className="text-white/70">Month-to-month service with the freedom to cancel anytime.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Future-Proof Technology</h3>
                  <p className="text-white/70">Your AI agent gets smarter and more capable with every update.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
