
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-8 bg-card" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

          {/* Compare Links */}
          <nav className="flex flex-col items-center md:items-start gap-2" aria-label="Comparison pages">
            <p className="text-sm font-semibold text-foreground mb-1">Compare</p>
            <Link to="/compare/vs-smith-ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs Smith.ai
            </Link>
            <Link to="/compare/vs-my-ai-front-desk" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              AI Agents 3000 vs My AI Front Desk
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

