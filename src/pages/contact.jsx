import React from 'react'

const Contact = () => (
  <div className="relative min-h-screen bg-gradient-to-b from-green-900 via-green-950 to-black text-white pt-40 pb-20 px-6 lg:px-16 overflow-hidden">
    <div className="container mx-auto px-6 lg:px-16 grid md:grid-cols-2 gap-20">
      <div className="text-white space-y-8">
        <h2 className="text-6xl font-black tracking-tighter">Get in <br/> <span className="text-green-400">Touch.</span></h2>
        <p className="text-white/60 text-lg">Have questions about our brewing process or wholesale? We'd love to hear from you.</p>
        <div className="space-y-4 font-bold tracking-widest text-sm">
          <p className="flex items-center gap-4"><span className="w-10 h-px bg-green-400"></span> HELLO@TEAESTATE.COM</p>
          <p className="flex items-center gap-4"><span className="w-10 h-px bg-green-400"></span> +880 1234 5678</p>
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10">
        <form className="space-y-6">
          <input type="text" placeholder="YOUR NAME" className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:border-green-400 outline-none transition-colors" />
          <input type="email" placeholder="YOUR EMAIL" className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:border-green-400 outline-none transition-colors" />
          <textarea placeholder="YOUR MESSAGE" rows="4" className="w-full bg-transparent border-b border-white/20 py-4 text-white focus:border-green-400 outline-none transition-colors"></textarea>
          <button className="w-full bg-green-500 py-5 rounded-full font-black text-white tracking-[0.2em] text-xs hover:bg-green-400 transition-all">SEND MESSAGE</button>
        </form>
      </div>
    </div>
  </div>
);
export default Contact;