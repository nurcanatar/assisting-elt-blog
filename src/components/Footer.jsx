import React, { useState } from 'react';
import { BookOpenCheck, Send, Mail, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function Footer({ setActivePage, setSelectedCategory }) {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setActivePage('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer class="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
                <BookOpenCheck class="w-6 h-6" />
              </div>
              <span class="text-2xl font-black text-white tracking-tight">
                assisting<span class="text-brand-400">.com</span>
              </span>
            </div>
            
            <p class="text-slate-400 text-sm leading-relaxed max-w-sm">
              Ortaokul (5, 6, 7 ve 8. sınıf) İngilizce öğretmenleri ve öğrencileri için hazırlanan ücretsiz ders materyalleri, LGS İngilizce çalışma kağıtları, oyunlar ve AI prompt rehberi.
            </p>

            <div class="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 p-3 rounded-lg border border-slate-700 w-fit">
              <ShieldCheck class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ortaokul MEB İngilizce müfredatına %100 uyumludur.</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-white mb-4">Hızlı Bağlantılar</h4>
            <ul class="space-y-2.5 text-sm">
              <li>
                <button onClick={() => { setActivePage('home'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors">Ana Sayfa</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('teacher'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors font-bold text-indigo-400">👩‍🏫 Öğretmen Masası</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('student'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors font-bold text-brand-400">🎒 Öğrenci Portalı</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('blog'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors">Tüm İngilizce Materyalleri</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('categories'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors">Sınıf Seviyeleri (5-8)</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('about'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors">Hakkımızda</button>
              </li>
              <li>
                <button onClick={() => { setActivePage('contact'); window.scrollTo(0, 0); }} class="hover:text-white transition-colors">İletişim & SSS</button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-white mb-4">Sınıf & Konular</h4>
            <ul class="space-y-2.5 text-sm">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <button 
                    onClick={() => handleCategoryClick(cat.id)}
                    class="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h4 class="text-sm font-bold uppercase tracking-wider text-white mb-4">İngilizce Öğretmeni Bülteni</h4>
            <p class="text-xs text-slate-400 mb-3">
              Haftalık yeni 5-8. sınıf yazdırılabilir materyalleri e-posta adresinize gönderelim.
            </p>

            {subscribed ? (
              <div class="p-3 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-300 text-xs flex items-center space-x-2">
                <CheckCircle2 class="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Aboneliğiniz alındı! Teşekkürler.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} class="space-y-2">
                <div class="relative">
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <Mail class="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                </div>
                <button
                  type="submit"
                  class="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors shadow-md"
                >
                  <Send class="w-3.5 h-3.5" />
                  <span>Abone Ol</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div class="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} assisting.com - Ortaokul İngilizce Materyalleri Portal. Tüm hakları saklıdır.</p>
          <div class="flex items-center space-x-1">
            <span>İngilizce Öğretmenleri İçin Sevgiyle Hazırlandı</span>
            <Heart class="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          </div>
        </div>

      </div>
    </footer>
  );
}
