
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    Services: [
      { label: "Voice AI Receptionist", href: "/voice-ai-receptionist" }
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Pricing", href: "/#pricing" }
    ],
    Resources: [
      { label: "Help Center", href: "/#contact" },
      { label: "Contact", href: "/#contact" },
      { label: "Privacy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms-of-service" }
    ],
    Social: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Twitter", href: "https://twitter.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
      { label: "Facebook", href: "https://facebook.com" }
    ]
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "https://instagram.com", label: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Github className="w-5 h-5" />, href: "https://github.com", label: "GitHub" }
  ];

  return (
    <footer className="border-t border-white/10 px-6 py-16" role="contentinfo" aria-label="Footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-white font-semibold text-xl mb-4">Veridian</div>
            <p className="text-white/70 mb-6 max-w-sm">
              Never miss another customer call with our intelligent 24/7 Voice AI receptionist service.
            </p>
            <nav className="flex space-x-4" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                  aria-label={`Follow us on ${social.label} - opens in new tab`}
                >
                  {social.icon}
                </a>
              ))}
            </nav>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-labelledby={`footer-${category.toLowerCase()}-heading`}>
              <h3 id={`footer-${category.toLowerCase()}-heading`} className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                      >
                        {link.label}
                      </a>
                    ) : link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            © 2024 Veridian. All rights reserved.
          </p>
          <nav className="flex space-x-6 text-sm" aria-label="Legal links">
            <Link to="/privacy-policy" className="text-white/40 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-white/40 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-white/40 hover:text-white transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm">
              Cookie Policy
            </Link>
          </nav>
        </div>

        {/* DAG Networks Credit */}
        <div className="text-center pt-6 border-t border-white/5 mt-6">
          <a 
            href="https://www.dagnetworks.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/50 transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
            aria-label="Visit DAG Networks website - opens in new tab"
          >
            Created by DAG Networks
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
