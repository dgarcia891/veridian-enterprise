import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";

const sections = [
  { id: "problem", label: "The Problem" },
  { id: "solution", label: "The Solution" },
  { id: "calculator", label: "Calculator" },
  { id: "growth", label: "Growth" },
  { id: "about", label: "About", route: "/about" },
  { id: "faq", label: "FAQ", route: "/faq" },
];

const ROINavigation = () => {
  const navigate = useNavigate();
  const activeSection = useScrollSpy(sections.map(s => s.id));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string, route?: string) => {
    if (route) {
      navigate(route);
      setMobileMenuOpen(false);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for sticky nav
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-background/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={() => navigate("/")}
            className="flex-shrink-0 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            The AI Agent ROI
          </button>

          {/* Mobile: Phone + Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a 
              href="tel:661-523-0269"
              className="flex items-center gap-1 text-foreground hover:opacity-80 transition-opacity"
              aria-label="Call us at 661-523-0269"
            >
              <Phone size={16} aria-hidden="true" />
              <span className="text-xs font-medium">661-523-0269</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <a 
              href="tel:661-523-0269"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
              aria-label="Call us at 661-523-0269"
            >
              <Phone size={16} aria-hidden="true" />
              <span className="text-sm font-medium">661-523-0269</span>
            </a>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id, section.route)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
            <Button 
              onClick={() => navigate("/schedule-consultation")}
              className="ml-4"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id, section.route)}
                className={`block w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent"
                }`}
              >
                {section.label}
              </button>
            ))}
            <Button 
              onClick={() => navigate("/schedule-consultation")}
              className="w-full mt-2"
            >
              Get Started
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default ROINavigation;
