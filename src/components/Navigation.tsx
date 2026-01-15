import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { getActiveServices } from "@/data/services";
import { useAnalytics } from "@/hooks/useAnalytics";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import logo from "@/assets/logo.png";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const activeServices = getActiveServices();
  const { trackCTAClick } = useAnalytics();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin");

        if (roles && roles.length > 0) {
          setIsAdmin(true);
        }
      }
    };
    checkAdminStatus();
  }, []);

  const navItems = [
    { href: "/", label: "Home", type: "link" },
    { href: "/about", label: "About", type: "link" },
    { label: "Services", type: "dropdown", items: activeServices },
    { href: "/#pricing", label: "Pricing", type: "hash" },
    { href: "/blog", label: "Blog", type: "link" },
    { href: "/audit", label: "Free AI Audit", type: "link" },
    { href: "/contact", label: "Contact", type: "link" }
  ];

  if (isAdmin) {
    navItems.push({
      label: "Admin",
      type: "dropdown",
      href: "/admin/blog",
      items: [
        { id: "blog", name: "Blog Management", href: "/admin/blog", tagline: "Manage posts & content" },
        { id: "ai", name: "AI Config", href: "/admin/blog/ai-settings", tagline: "Pipeline & Verification" },
        { id: "analytics", name: "Analytics", href: "/admin/analytics", tagline: "View site performance" }
        // @ts-expect-error - Casting to match Service type structure
      ] as unknown as any
    });
  }
  return <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-card" role="navigation" aria-label="Main navigation">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
        aria-label="AI Agents 3000 home"
      >
        <img src={logo} alt="AI Agents 3000 Logo" className="h-12 w-auto" />
      </Link>

      {/* Mobile: Phone + Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <a
          href="tel:661-263-4388"
          className="flex items-center gap-1 text-foreground hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
          aria-label="Call us at 661-263-4388"
        >
          <Phone size={16} aria-hidden="true" />
          <span className="text-xs font-medium">661-263-4388</span>
        </a>
        <button
          className="p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6 text-sm" role="menubar">
        {navItems.map((item, idx) => {
          if (item.type === "dropdown") {
            return (
              <div key={idx} className="flex items-center">
                <Link
                  to={item.href || "/services"}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
                  role="menuitem"
                >
                  {item.label}
                </Link>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm"
                      aria-haspopup="true"
                      aria-label={`View ${item.label} menu`}
                    >
                      <ChevronDown size={16} className="transition-transform duration-200" aria-hidden="true" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0 bg-card border-border" align="start">
                    <div className="overflow-hidden">
                      {item.items?.map((service) => (
                        <Link
                          key={service.id}
                          to={service.href || `/services/${service.slug}`}
                          className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <div className="font-semibold">{service.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{service.tagline}</div>
                        </Link>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
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

      {/* Phone Number & Desktop CTA */}
      <div className="hidden md:flex items-center gap-4">
        <a
          href="tel:661-263-4388"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary rounded-sm px-2 py-1"
          aria-label="Call us at 661-263-4388"
        >
          <Phone size={16} aria-hidden="true" />
          <span className="text-sm font-medium">661-263-4388</span>
        </a>

        <Button
          className="glass-button rounded-full px-6 py-2 text-sm hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => {
            trackCTAClick("Get 100% Lead Capture", "Desktop Navigation");
            navigate("/schedule-consultation");
          }}
          aria-label="Get 100% Lead Capture"
        >
          Get 100% Lead Capture
        </Button>
      </div>
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
                <Link
                  to={item.href || "/services"}
                  className="text-muted-foreground font-semibold text-sm hover:text-foreground transition-colors"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                >
                  {item.label}
                </Link>
                {item.items?.map((service) => (
                  <Link
                    key={service.id}
                    to={service.href || `/services/${service.slug}`}
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
            trackCTAClick("Get Started", "Mobile Navigation");
            setIsOpen(false);
            navigate("/signup");
          }}
          aria-label="Get started with AI Agents 3000"
        >
          Get Started
        </Button>
      </div>
    </div>}
  </nav>;
};
export default Navigation;