// components/common/Footer.js
import React from 'react';
import Link from 'next/link';
import { Twitter, Instagram, Facebook, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription logic here
    console.log('Subscribing with email:', email);
    setEmail('');
    // You would typically show a toast notification here
  };

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Authors', href: '/authors' },
    { name: 'Publishers', href: '/publishers' },
    { name: 'Self Publication', href: '/self-publication' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Help (FAQ)', href: '/faq' },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const featuredImages = [
      { src: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Cozy reading nook with a lamp" },
      { src: "https://images.pexels.com/photos/1181498/pexels-photo-1181498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Person reading a book in a stylish setting" },
      { src: "https://images.pexels.com/photos/433308/pexels-photo-433308.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Vintage typewriter with a book" },
      { src: "https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", alt: "Artistic display of books" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Image Gallery Section */}
      <div className="border-b border-gray-800 py-12">
        <div className="container text-center">
            <h3 className="text-lg font-semibold mb-8 text-gray-400 uppercase tracking-wider">Join Our Literary World</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {featuredImages.map((image, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg">
                        <img src={image.src} alt={image.alt} className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300" />
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* About Porboi.in */}
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-6">About porboi.in</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Porboi.in is your premier destination for discovering classic literature and supporting new voices. We are passionate about the power of stories to connect and inspire.
              </p>
              <div className="flex space-x-4 mt-6">
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

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 text-sm hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="md:col-span-2 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-6">Join Our Newsletter</h3>
              <p className="text-gray-400 text-sm mb-6">
                Subscribe to receive updates on new arrivals, special offers, and upcoming events. Be part of our community of readers.
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address..."
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder-gray-400 focus:outline-none focus:border-red-600 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-red-600 text-white rounded-r-md hover:bg-red-700 transition-colors duration-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="container text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} porboi.in, ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
