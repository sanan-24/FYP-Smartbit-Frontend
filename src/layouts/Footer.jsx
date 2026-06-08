import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-950 text-white pt-24 pb-12 border-t border-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Smart Bite" className="h-12 w-auto rounded-full" />
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Smart Bite
              </h2>
            </Link>
            <p className="text-secondary-400 text-base leading-relaxed font-medium">
              We're on a mission to bring the world's most exquisite flavors to your doorstep, one perfect delivery at a time.
            </p>
            <div className="flex space-x-5">
              {[Globe, Share2].map((Icon, idx) => (
                <button key={idx} className="w-12 h-12 rounded-2xl bg-secondary-900 flex items-center justify-center hover:bg-primary-500 hover:scale-110 transition-all text-secondary-300 hover:text-white shadow-soft">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Cravings</h3>
            <ul className="space-y-4 text-secondary-400 text-base font-bold">
              <li><Link to="/" className="hover:text-primary-500 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="hover:text-primary-500 transition-colors">The Menu</Link></li>
              <li><Link to="/favorites" className="hover:text-primary-500 transition-colors">Your Favorites</Link></li>
              <li><Link to="/orders" className="hover:text-primary-500 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/about" className="hover:text-secondary-300">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-secondary-300">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-secondary-300">FAQ</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary-300">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-secondary-300" />
                <span>123 Food Street, Tasty City, FC 45678</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-secondary-300" />
                <span>+1 234 567 890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary-300" />
                <span>support@smartbite.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-xs">
          <p>(c) {new Date().getFullYear()} Smart Bite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

