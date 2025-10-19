import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">About Veridian</h1>
        <p className="text-xl text-white/70 mb-16 text-center max-w-3xl mx-auto">
          Transforming social media presence into powerful revenue drivers through data-driven marketing strategies.
        </p>

        <section className="space-y-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-white/80 leading-relaxed">
                At Veridian, we believe that every business deserves to harness the full potential of social media marketing. Our mission is to empower companies with cutting-edge tools and strategies that convert social engagement into measurable business growth.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-lg border border-white/10">
              <div className="text-5xl font-bold text-primary mb-2">500+</div>
              <p className="text-white/70">Businesses Transformed</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 rounded-lg border border-white/10 md:order-2">
              <div className="text-5xl font-bold text-primary mb-2">$50M+</div>
              <p className="text-white/70">Revenue Generated for Clients</p>
            </div>
            <div className="md:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-white/80 leading-relaxed">
                We envision a world where businesses of all sizes can compete on equal footing in the digital marketplace. By democratizing access to sophisticated marketing automation and analytics, we're leveling the playing field.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Innovation</h3>
                <p className="text-white/70">
                  We constantly push the boundaries of what's possible in marketing technology, staying ahead of industry trends.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Integrity</h3>
                <p className="text-white/70">
                  We believe in transparent practices, honest communication, and delivering on our promises to every client.
                </p>
              </div>
              <div className="bg-white/5 p-8 rounded-lg border border-white/10 hover:border-primary/50 transition-colors">
                <h3 className="text-xl font-semibold mb-4 text-primary">Results</h3>
                <p className="text-white/70">
                  We're obsessed with measurable outcomes and ROI, ensuring every campaign drives real business value.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-white/10">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Founded in 2020, Veridian emerged from a simple observation: businesses were struggling to connect their social media efforts to actual revenue. Traditional marketing agencies offered creative services, but lacked the data-driven approach needed in the modern digital landscape.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              Our founders, veterans of both Silicon Valley tech companies and traditional marketing firms, saw an opportunity to bridge this gap. By combining cutting-edge automation technology with proven marketing strategies, Veridian was born.
            </p>
            <p className="text-white/80 leading-relaxed">
              Today, we serve hundreds of businesses across industries, from startups to Fortune 500 companies, helping them transform their social media presence into a predictable revenue engine.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Veridian</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Data-Driven Approach</h3>
                  <p className="text-white/70">Every decision backed by analytics and real-time performance metrics.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Proven Track Record</h3>
                  <p className="text-white/70">Consistently delivering 3x ROI for our clients across all industries.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
                  <p className="text-white/70">Our specialists bring decades of combined experience in marketing and technology.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-primary/20 p-2 rounded">
                  <div className="w-6 h-6 bg-primary rounded"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ongoing Support</h3>
                  <p className="text-white/70">Dedicated account managers and 24/7 customer support for all clients.</p>
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
