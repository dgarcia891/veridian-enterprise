import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getActiveServices } from "@/data/services";
import { useRetellWidget } from "@/hooks/useRetellWidget";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { isWidgetReady, openChat } = useRetellWidget();
  const activeServices = getActiveServices();

  const navItems = [
    { href: "/", label: "Home", type: "link" },
    { href: "/about", label: "About", type: "link" },
    { label: "Services", type: "dropdown", items: activeServices },
    { href: "/#pricing", label: "Pricing", type: "hash" },
    { href: "/contact", label: "Contact", type: "link" }
  ];
  return <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-card" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-foreground font-bold text-xl hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-sm" 
          aria-label="Veridian Enterprises LLC home"
        >
          Veridian Enterprises LLC
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6 text-sm" role="menubar">
          {navItems.map((item, idx) => {
            if (item.type === "dropdown") {
              return (
                <div 
                  key={idx}
                  className="relative group"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                  >
                    {item.label}
                    <ChevronDown size={16} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                  
                  {servicesOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass-card rounded-xl shadow-lg overflow-hidden animate-fade-in">
                      {item.items?.map((service) => (
                        <Link
                          key={service.id}
                          to={`/services/${service.slug}`}
                          className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          onClick={() => setServicesOpen(false)}
                        >
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{service.tagline}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            
            if (item.type === "hash") {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
                  role="menuitem"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" aria-hidden="true"></span>
                </a>
              );
            }
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 relative group focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
                role="menuitem"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" aria-hidden="true"></span>
              </Link>
            );
          })}
        </div>

        {/* Desktop CTA Button */}
        <Button 
          className="hidden md:block glass-button rounded-full px-6 py-2 text-sm hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={openChat}
          disabled={!isWidgetReady}
          aria-label="Get started with Veridian Enterprises LLC"
        >
          Get Started
        </Button>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <div 
          id="mobile-menu"
          className="md:hidden mt-4 glass-card rounded-2xl mx-6 p-6 animate-fade-in" 
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item, idx) => {
              if (item.type === "dropdown") {
                return (
                  <div key={idx} className="space-y-2">
                    <div className="text-muted-foreground font-semibold text-sm">{item.label}</div>
                    {item.items?.map((service) => (
                      <Link
                        key={service.id}
                        to={`/services/${service.slug}`}
                        className="block pl-4 py-2 text-foreground/80 hover:text-foreground transition-colors"
                        onClick={() => setIsOpen(false)}
                        role="menuitem"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                );
              }
              
              if (item.type === "hash") {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground/80 hover:text-foreground transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                    role="menuitem"
                  >
                    {item.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </Link>
              );
            })}
            
            <Button 
              className="mt-4 glass-button rounded-full py-3 transition-all duration-200"
              onClick={() => {
                setIsOpen(false);
                openChat();
              }}
              disabled={!isWidgetReady}
              aria-label="Get started with Veridian Enterprises LLC"
            >
              Get Started
            </Button>
          </div>
        </div>}
    </nav>;
};
export default Navigation;