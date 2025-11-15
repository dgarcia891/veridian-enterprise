
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border px-6 py-8 bg-card" role="contentinfo" aria-label="Footer">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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

          {/* Legal Links */}
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Legal links">
            <Link
              to="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookie-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
            >
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

