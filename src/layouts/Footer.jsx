import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Share2, Mail, Phone, MapPin, UtensilsCrossed } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-secondary-950 text-white py-12 border-t border-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-x-24">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="/logo.png" alt="Smart Bite" className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
              <h2 className="text-3xl font-black text-white tracking-tighter">
                Smart<span className="text-primary-500">Bite</span>
              </h2>
            </Link>
            <p className="text-secondary-400 text-base leading-relaxed font-medium max-w-sm">
              We're on a mission to bring the world's most exquisite flavors to your doorstep, one perfect delivery at a time.
            </p>
            <div className="flex space-x-4">
              {[Globe, Share2].map((Icon, idx) => (
                <button key={idx} className="w-12 h-12 rounded-2xl bg-secondary-900 flex items-center justify-center hover:bg-primary-500 hover:scale-110 transition-all text-secondary-300 hover:text-white shadow-soft">
                  <Icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 md:pl-12">
            <h3 className="text-lg font-black text-white tracking-tight uppercase">Cravings</h3>
            <ul className="space-y-4 text-secondary-400 text-base font-bold">
              <li><Link to="/" className="hover:text-primary-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Home</Link></li>
              <li><Link to="/menu" className="hover:text-primary-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>The Menu</Link></li>
              <li><Link to="/favorites" className="hover:text-primary-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Your Favorites</Link></li>
              <li><Link to="/orders" className="hover:text-primary-500 transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>Track Order</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-black text-white tracking-tight uppercase">Contact Info</h3>
            <ul className="space-y-5 text-secondary-400 text-base font-bold">
              <li className="flex items-start space-x-4 group">
                <div className="bg-secondary-900 p-2.5 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                  <MapPin className="h-5 w-5 text-primary-500" />
                </div>
                <span className="font-semibold text-secondary-300 pt-1">Z Town, Multan</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="bg-secondary-900 p-2.5 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                  <Phone className="h-5 w-5 text-primary-500" />
                </div>
                <span className="font-semibold text-secondary-300 pt-1">03177659105</span>
              </li>
              <li className="flex items-start space-x-4 group">
                <div className="bg-secondary-900 p-2.5 rounded-xl group-hover:bg-primary-500/10 transition-colors">
                  <Mail className="h-5 w-5 text-primary-500" />
                </div>
                <span className="font-semibold text-secondary-300 pt-1">smartbite86@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 text-center text-slate-500 text-xs">
          <p>&copy; {new Date().getFullYear()} Smart Bite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

