import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const sections = [
  { id: "problem", label: "The Problem" },
  { id: "solution", label: "The Solution" },
  { id: "calculator", label: "Calculator" },
  { id: "growth", label: "Growth" },
];

const ROINavigation = () => {
  const navigate = useNavigate();
  const activeSection = useScrollSpy(sections.map(s => s.id));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
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
              onClick={() => navigate("/signup")}
              className="ml-4"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:bg-accent"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
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
              onClick={() => navigate("/signup")}
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
