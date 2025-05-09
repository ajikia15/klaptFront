import { FC } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const Footer: FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-neutral-800/70 border-t bg-neutral-800">
      {/* Main Footer Content */}
      <div className="container mx-auto pb-8 pt-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-purple-400 to-secondary-300 bg-clip-text text-2xl font-bold text-transparent">
                Kaido
              </span>
            </div>

            <p className="text-sm leading-relaxed text-neutral-400">
              {t('footerDesc')}
            </p>

            {/* Social Media Links */}
            <div className="flex gap-4">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-neutral-700/50 flex h-9 w-9 items-center justify-center rounded-lg border bg-neutral-800 text-neutral-300 transition-all duration-300 hover:border-secondary-600 hover:bg-secondary-700 hover:text-white"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-neutral-700/50 flex h-9 w-9 items-center justify-center rounded-lg border bg-neutral-800 text-neutral-300 transition-all duration-300 hover:border-secondary-600 hover:bg-secondary-700 hover:text-white"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-neutral-700/50 flex h-9 w-9 items-center justify-center rounded-lg border bg-neutral-800 text-neutral-300 transition-all duration-300 hover:border-secondary-600 hover:bg-secondary-700 hover:text-white"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-neutral-700/50 flex h-9 w-9 items-center justify-center rounded-lg border bg-neutral-800 text-neutral-300 transition-all duration-300 hover:border-secondary-600 hover:bg-secondary-700 hover:text-white"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="h-1 w-4 rounded-full bg-secondary-500"></div>
              {t('quickLinks')}
            </h3>
            <ul className="space-y-3">
              {[
                t('home'),
                t('aboutUs'),
                t('products'),
                t('support'),
                t('blog'),
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="group flex items-center text-neutral-400 transition-colors hover:text-secondary-400"
                  >
                    <span>{link}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-1.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Laptops */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="h-1 w-4 rounded-full bg-secondary-500"></div>
              {t('laptops')}
            </h3>
            <ul className="space-y-3">
              {[
                t('gamingLaptops'),
                t('businessLaptops'),
                t('studentLaptops'),
                t('creativeLaptops'),
                t('budgetLaptops'),
              ].map((link) => (
                <li key={link}>
                  <Link
                    to="/"
                    className="group flex items-center text-neutral-400 transition-colors hover:text-secondary-400"
                  >
                    <span>{link}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-1.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
              <div className="h-1 w-4 rounded-full bg-secondary-500"></div>
              {t('contactUs')}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone size={18} className="mr-3 mt-0.5 text-secondary-400" />
                <span className="text-neutral-300">+995 599 123 456</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="mr-3 mt-0.5 text-secondary-400" />
                <a
                  href="mailto:info@klaptop.com"
                  className="text-neutral-300 transition-colors hover:text-secondary-400"
                >
                  info@klaptop.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-0.5 text-secondary-400" />
                <span className="text-neutral-300">
                  123 Tech Street, Tbilisi, Georgia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter - Optional */}
        <div className="mt-16 border-t border-neutral-800 pt-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-md">
              <h4 className="mb-2 font-medium text-white">
                Subscribe to our newsletter
              </h4>
              <p className="text-sm text-neutral-400">
                Get the latest news and updates about our products.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="focus:ring-secondary-500/50 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-neutral-200 focus:border-secondary-400 focus:outline-none focus:ring-2"
              />
              <Button variant={'secondary'}>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-neutral-800/50 border-t bg-neutral-950/50 py-6 backdrop-blur-sm">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-sm text-neutral-500">
            © {currentYear} Klaptop. {t('allRightsReserved')}
          </div>

          <div className="flex gap-6">
            <Link
              to="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
            >
              Terms of Service
            </Link>
            <Link
              to="/"
              className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
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
