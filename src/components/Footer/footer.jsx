import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Linkedin, 
  MessageCircle, // Used for WhatsApp
  Leaf, 
  Mail, 
  MapPin, 
  ShieldCheck 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white py-16 px-6 lg:px-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-default">
              <Leaf className="text-green-500 group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold tracking-tighter">TEA ESTATE</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Sourcing the world’s finest organic leaves since 1994. From our soil to your soul.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6 text-green-400 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="/shop" className="hover:text-white transition-colors">Our Collection</a></li>
              <li><a href="/process" className="hover:text-white transition-colors">The Process</a></li>
              <li><a href="/wholesale" className="hover:text-white transition-colors">Wholesale</a></li>
              <li><a href="/admin" className="flex items-center gap-2 hover:text-green-400 transition-colors">
                <ShieldCheck size={14} /> Admin Portal
              </a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-6 text-green-400 uppercase tracking-widest text-xs">Visit Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><MapPin size={16} /> Dhaka, Bengladesh</li>
              <li className="flex items-center gap-2"><Mail size={16} /> hello@teaestate.com</li>
            </ul>
          </div>

          {/* Newsletter / Dynamic Element */}
          <div>
            <h4 className="font-semibold mb-6 text-green-400 uppercase tracking-widest text-xs">Stay Rooted</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-white/5 border border-white/10 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-green-500 w-full"
              />
              <button className="bg-green-600 hover:bg-green-500 text-black font-bold px-4 py-2 text-xs uppercase transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.3em] font-medium text-gray-500 uppercase">
            © 2026 TEA ESTATE • PURELY ORGANIC • ALL RIGHTS RESERVED
          </p>
          
          {/* Social Icons - Updated with Facebook, LinkedIn, WhatsApp, and X */}
          <div className="flex gap-5">
            <a href="#" className="text-gray-400 hover:text-[#1877F2] transition-all transform hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-all transform hover:-translate-y-1">
              {/* Custom SVG for X (Twitter) */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-[#E4405F] transition-all transform hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#0A66C2] transition-all transform hover:-translate-y-1">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#25D366] transition-all transform hover:-translate-y-1">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;