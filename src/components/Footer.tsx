
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Services: ["Strategy", "Content Creation", "Paid Advertising", "Analytics"],
    Company: ["About", "Careers", "Case Studies", "Blog"],
    Resources: ["Help Center", "Contact", "Privacy", "Terms"],
    Social: ["Instagram", "Twitter", "LinkedIn", "Facebook"]
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: "#" },
    { icon: <Instagram className="w-5 h-5" />, href: "#" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#" },
    { icon: <Github className="w-5 h-5" />, href: "#" }
  ];

  return (
    <footer className="border-t border-white/10 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-white font-semibold text-xl mb-4">Veridian</div>
            <p className="text-white/70 mb-6 max-w-sm">
              Transform your social media presence into a powerful revenue driver with our data-driven marketing strategies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-white/40 hover:text-white transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            © 2024 Veridian. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-white/40 hover:text-white transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* DAG Networks Credit */}
        <div className="text-center pt-6 border-t border-white/5 mt-6">
          <a 
            href="https://www.dagnetworks.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/30 hover:text-white/50 transition-colors duration-300 text-sm"
          >
            Created by DAG Networks
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
