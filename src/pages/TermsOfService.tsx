import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>
        <p className="text-white/70 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="space-y-6 text-white/80">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI Agents 3000's services (a subsidiary of Veridian Enterprises LLC), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Services</h2>
            <p className="mb-3">Our services are provided for business and marketing purposes. You agree to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use our services in compliance with all applicable laws and regulations</li>
              <li>Not misuse or abuse our platform or services</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Intellectual Property</h2>
            <p>
              All content, features, and functionality of our services are owned by AI Agents 3000 and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Payment Terms</h2>
            <p className="mb-3">For paid services:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fees are charged according to the selected plan</li>
              <li>Payment is due at the beginning of each billing cycle</li>
              <li>We reserve the right to modify pricing with 30 days notice</li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Service Availability</h2>
            <p>
              While we strive to provide uninterrupted service, we do not guarantee that our services will be available at all times. We reserve the right to modify, suspend, or discontinue services with reasonable notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Limitation of Liability</h2>
            <p>
              AI Agents 3000 shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our platform. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which AI Agents 3000 operates, without regard to its conflict of law provisions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:legal@veridian.com" className="text-primary hover:underline">
                legal@veridian.com
              </a>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
