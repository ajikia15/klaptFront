import { FC } from "react";
import { Link } from "@tanstack/react-router";
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";

const Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 border-t border-neutral-800/70">
      {/* Main Footer Content */}
      <div className="container mx-auto pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-secondary-300">
                Kaido
              </span>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium gaming and professional laptops with cutting-edge
              technology. Find the perfect device for your computing needs.
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-secondary-700 flex items-center justify-center transition-all duration-300 border border-neutral-700/50 hover:border-secondary-600 text-neutral-300 hover:text-white"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-secondary-700 flex items-center justify-center transition-all duration-300 border border-neutral-700/50 hover:border-secondary-600 text-neutral-300 hover:text-white"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-secondary-700 flex items-center justify-center transition-all duration-300 border border-neutral-700/50 hover:border-secondary-600 text-neutral-300 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-neutral-800 hover:bg-secondary-700 flex items-center justify-center transition-all duration-300 border border-neutral-700/50 hover:border-secondary-600 text-neutral-300 hover:text-white"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
              <div className="h-1 w-4 bg-secondary-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["Home", "About Us", "Products", "Support", "Blog"].map(
                (link) => (
                  <li key={link}>
                    <Link
                      to="/"
                      className="text-neutral-400 hover:text-secondary-400 transition-colors flex items-center group"
                    >
                      <span>{link}</span>
                      <ArrowUpRight
                        size={14}
                        className="ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Laptops */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
              <div className="h-1 w-4 bg-secondary-500 rounded-full"></div>
              Laptops
            </h3>
            <ul className="space-y-3">
              {[
                "Gaming Laptops",
                "Business Laptops",
                "Student Laptops",
                "Creative Laptops",
                "Budget Laptops",
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="text-neutral-400 hover:text-secondary-400 transition-colors flex items-center group"
                  >
                    <span>{link}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2 text-lg">
              <div className="h-1 w-4 bg-secondary-500 rounded-full"></div>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="text-secondary-400 mr-3 mt-0.5" />
                <span className="text-neutral-300">+995 599 123 456</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-secondary-400 mr-3 mt-0.5" />
                <a
                  href="mailto:info@klaptop.com"
                  className="text-neutral-300 hover:text-secondary-400 transition-colors"
                >
                  info@klaptop.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="text-secondary-400 mr-3 mt-0.5" />
                <span className="text-neutral-300">
                  123 Tech Street, Tbilisi, Georgia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter - Optional */}
        <div className="mt-16 pt-8 border-t border-neutral-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-md">
              <h4 className="text-white font-medium mb-2">
                Subscribe to our newsletter
              </h4>
              <p className="text-neutral-400 text-sm">
                Get the latest news and updates about our products.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-400"
              />
              <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-neutral-950/50 backdrop-blur-sm py-6 border-t border-neutral-800/50">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-neutral-500 text-sm">
            © {currentYear} Klaptop. All rights reserved.
          </div>

          <div className="flex gap-6">
            <Link
              to="/"
              className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
