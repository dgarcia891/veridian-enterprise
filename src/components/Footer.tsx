
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { getActiveServices } from "@/data/services";

const Footer = () => {
  const activeServices = getActiveServices();
  
  const footerLinks = {
    Services: activeServices.map(service => ({
      label: service.name,
      href: `/services/${service.slug}`
    })),
    Company: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Contact", href: "/contact" }
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
    <footer className="border-t border-border px-6 py-16 bg-card" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-foreground font-bold text-xl mb-4">Veridian Enterprises LLC</div>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Never miss another customer call with our intelligent 24/7 Voice AI receptionist service.
            </p>
            <nav className="flex space-x-4" aria-label="Social media links">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
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
              <h3 id={`footer-${category.toLowerCase()}-heading`} className="text-foreground font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                      >
                        {link.label}
                      </a>
                    ) : link.href.startsWith('/') ? (
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
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
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2024 Veridian Enterprises LLC. All rights reserved.
          </p>
          <nav className="flex space-x-6 text-sm" aria-label="Legal links">
            <Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">
              Cookie Policy
            </Link>
          </nav>
        </div>

        {/* DAG Networks Credit */}
        <div className="text-center pt-6 border-t border-border/50 mt-6">
          <a 
            href="https://www.dagnetworks.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
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
