import React from 'react';
import { Link } from 'react-router-dom';
import {
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  Leaf,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0b0f0d] text-white py-16 px-6 lg:px-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div className="space-y-4">
            <div className="flex items-center gap-2 group cursor-default">
              <Leaf className="text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold tracking-tighter">TEA ESTATE</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              A premium tea ecommerce brand delivering fresh estate-picked leaves with trusted quality and curated flavor profiles.
            </p>
            <div className="space-y-2 text-xs text-white/70">
              <p className="flex items-center gap-2"><Truck size={14} className="text-emerald-300" /> Nationwide express shipping</p>
              <p className="flex items-center gap-2"><BadgeCheck size={14} className="text-emerald-300" /> 100% authentic, tested batches</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-emerald-300 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li><Link to="/products" className="hover:text-white transition-colors">Shop Collection</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
              <li>
                <Link to="/admin-login" className="flex items-center gap-2 hover:text-emerald-300 transition-colors">
                  <ShieldCheck size={14} /> Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-emerald-300 uppercase tracking-widest text-xs">Visit Us</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2"><MapPin size={16} /> Dhaka, Bangladesh</li>
              <li className="flex items-center gap-2"><Mail size={16} /> hello@teaestate.com</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-emerald-300 uppercase tracking-widest text-xs">Stay Rooted</h4>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-emerald-400 w-full"
              />
              <button className="bg-[#6fa884] hover:bg-[#5f9a74] text-white font-bold px-4 py-2 text-xs uppercase transition-all">
                Join
              </button>
            </div>
            <p className="text-[11px] text-white/50 mt-3">Get exclusive tasting notes, launch alerts, and seasonal offers.</p>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] tracking-[0.3em] font-medium text-white/50 uppercase">
            © 2026 TEA ESTATE • PREMIUM ECOMMERCE EXPERIENCE • ALL RIGHTS RESERVED
          </p>

          <div className="flex gap-5">
            <a href="#" className="text-white/60 hover:text-[#1877F2] transition-all transform hover:-translate-y-1" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-white transition-all transform hover:-translate-y-1" aria-label="X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
              </svg>
            </a>
            <a href="#" className="text-white/60 hover:text-[#E4405F] transition-all transform hover:-translate-y-1" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-[#0A66C2] transition-all transform hover:-translate-y-1" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-white/60 hover:text-[#25D366] transition-all transform hover:-translate-y-1" aria-label="WhatsApp">
              <MessageCircle size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
