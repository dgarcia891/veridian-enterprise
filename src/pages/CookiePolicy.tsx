import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookie Policy</h1>
        <p className="text-white/70 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-white/80">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">What Are Cookies</h2>
            <p>
              Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Cookies</h2>
            <p className="mb-3">We use cookies for various purposes:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Essential cookies: Required for the website to function properly</li>
              <li>Analytics cookies: Help us understand how visitors interact with our website</li>
              <li>Functional cookies: Remember your preferences and settings</li>
              <li>Marketing cookies: Track your activity to deliver relevant advertising</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Types of Cookies We Use</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3 mt-4">Session Cookies</h3>
            <p className="mb-4">
              Temporary cookies that expire when you close your browser. These are essential for navigating our website and using its features.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Persistent Cookies</h3>
            <p className="mb-4">
              Cookies that remain on your device for a set period or until you delete them. These help us remember your preferences and provide a personalized experience.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">Third-Party Cookies</h3>
            <p>
              Some cookies are placed by third-party services that appear on our pages. We use analytics tools and advertising networks that may set cookies to collect information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Managing Cookies</h2>
            <p className="mb-3">
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Using our cookie consent tool when you first visit our website</li>
              <li>Modifying your browser settings to refuse cookies</li>
              <li>Deleting cookies that have already been set</li>
            </ul>
            <p className="mt-3">
              Please note that blocking certain cookies may impact your experience on our website and limit the services we can provide.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Analytics and Tracking</h2>
            <p>
              We use analytics services like Google Analytics to collect information about how visitors use our website. This data helps us improve our services and user experience. The information collected is aggregated and anonymous.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. Please check this page periodically for updates.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us at{" "}
              <a href="mailto:privacy@veridian.com" className="text-primary hover:underline">
                privacy@veridian.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CookiePolicy;
