
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-8 bg-card" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand & Company Info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <img src={logo} alt="AI Agents 3000 Logo" className="h-12 w-auto" />
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} AI Agents 3000. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground">VERIDIAN ENTERPRISES LLC</p>
              <p className="text-xs text-muted-foreground">A Wyoming Limited Liability Company</p>
            </div>
          </div>

          {/* Services */}
          <nav className="flex flex-col items-center md:items-start gap-2" aria-label="Services">
            <p className="text-sm font-semibold text-foreground mb-1">Services</p>
            <Link to="/ai-receptionist" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Voice AI Receptionist</Link>
            <Link to="/services/ai-chat-widget" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Chat Widget</Link>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Services</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          </nav>

          {/* Industries */}
          <nav className="flex flex-col items-center md:items-start gap-2" aria-label="Industry pages">
            <p className="text-sm font-semibold text-foreground mb-1">Industries</p>
            <Link to="/restaurants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Restaurants</Link>
            <Link to="/plumbers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Plumbers</Link>
            <Link to="/hvac" className="text-sm text-muted-foreground hover:text-foreground transition-colors">HVAC</Link>
            <Link to="/electricians" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Electricians</Link>
            <Link to="/law-firms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Law Firms</Link>
            <Link to="/medical-offices" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Medical Offices</Link>
          </nav>

          {/* Compare Links */}
          <nav className="flex flex-col items-center md:items-start gap-2" aria-label="Comparison pages">
            <p className="text-sm font-semibold text-foreground mb-1">Compare</p>
            <Link to="/compare/vs-smith-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs Smith.ai
            </Link>
            <Link to="/compare/vs-my-ai-front-desk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs My AI Front Desk
            </Link>
            <Link to="/compare/vs-dialzara" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs Dialzara
            </Link>
            <Link to="/compare/vs-ruby-receptionists" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs Ruby Receptionists
            </Link>
            <Link to="/compare" className="text-sm text-primary hover:text-primary/80 transition-colors mt-1 font-medium">
              View All Comparisons
            </Link>
          </nav>

          {/* Legal Links */}
          <nav className="flex flex-col items-center md:items-start gap-2" aria-label="Legal links">
            <p className="text-sm font-semibold text-foreground mb-1">Legal</p>
            <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookie-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>

        {/* DAG Networks Credit & Admin */}
        <div className="flex flex-col items-center gap-2 pt-6 border-t border-border/50 mt-6">
          <a 
            href="https://www.dagnetworks.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            aria-label="Visit DAG Networks website - opens in new tab"
          >
            Created by DAG Networks
          </a>
          <Link
            to="/admin"
            className="text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors duration-300 text-xs focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

