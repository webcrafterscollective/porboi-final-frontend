
// components/common/Footer.js
import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Facebook, Dribbble, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe:', email);
    setEmail('');
  };

  const publisherLinks = [
    { name: 'Bestsellers', href: '/bestsellers' },
    { name: 'Interviews', href: '/interviews' },
    { name: 'Authors Story', href: '/authors-story' },
    { name: 'Book Fairs', href: '/book-fairs' },
    { name: 'Help (FAQ)', href: '/help' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Dribbble, href: '#', label: 'Dribbble' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Partner Logos Section */}
      <div className="border-b border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center space-x-12 opacity-60">
            {/* Partner logos would go here - using placeholder for now */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                📚
              </div>
              <span className="text-sm">BOOK LOGO</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                💭
              </div>
              <span className="text-sm">MAKE YOUR DREAM COME TRUE</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                🐘
              </div>
              <span className="text-sm">THINKING FORWARD</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                🎩
              </div>
              <span className="text-sm">POCKETBOOK</span>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center mb-2">
                📖
              </div>
              <span className="text-sm">ROYAL BOOKS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Publishers */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Publishers</h3>
              <ul className="space-y-3">
                {publisherLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact</h3>
              <div className="text-gray-400 space-y-4">
                <p>
                  Stay in touch with everything ChapterOne, follow us on social media and learn about new promotions.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6">News & Update</h3>
              <div className="text-gray-400 mb-6">
                <p>We'd love it if you subscribed to our newsletter! You'll love it too.</p>
              </div>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition-colors duration-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Social media</h3>
              <div className="text-gray-400">
                <p>Follow us on social media for updates and promotions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            © 2019 GODE INTERACTIVE, ALL RIGHTS RESERVED
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;