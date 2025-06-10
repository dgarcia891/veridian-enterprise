import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [{
    href: "#home",
    label: "Home"
  }, {
    href: "#features",
    label: "Services"
  }, {
    href: "#testimonials",
    label: "Testimonials"
  }, {
    href: "#pricing",
    label: "Pricing"
  }, {
    href: "#contact",
    label: "Contact"
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-white font-semibold text-xl">Veridian</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-white/80 text-sm">
          {navItems.map(item => <a key={item.href} href={item.href} className="hover:text-white transition-colors duration-300 relative group">
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>)}
        </div>

        {/* Desktop Connect Button */}
        <Button className="hidden md:block bg-transparent border border-white/20 text-white rounded-full px-6 py-2 text-sm hover:bg-white/10 transition-all duration-300">
          Get Started
        </Button>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && <div className="md:hidden mt-4 glass-card rounded-2xl mx-6 p-6 animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navItems.map(item => <a key={item.href} href={item.href} className="text-white/80 hover:text-white transition-colors duration-300 py-2" onClick={() => setIsOpen(false)}>
                {item.label}
              </a>)}
            <Button className="mt-4 bg-transparent border border-white/20 text-white rounded-full py-2 hover:bg-white/10 transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>}
    </nav>;
};
export default Navigation;