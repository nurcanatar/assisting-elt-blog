import React from 'react';
import { Sparkles, ArrowRight, BookOpenCheck, Compass, CheckCircle, GraduationCap } from 'lucide-react';
import PostCard from '../components/PostCard';
import CategoryCard from '../components/CategoryCard';
import { CATEGORIES } from '../data/categories';

export default function HomePage({ posts, onSelectPost, onSelectCategory, onNavigate }) {
  const featuredPosts = posts.filter(p => p.featured);
  const latestPosts = posts.slice(0, 6);

  return (
    <div class="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section class="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-slate-50 to-white pt-12 pb-16 sm:py-20 border-b border-slate-200/60">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Badge */}
            <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-brand-200 shadow-sm text-xs font-bold text-brand-700">
              <GraduationCap class="w-4 h-4 text-brand-600" />
              <span>Ortaokul 5, 6, 7 & 8. Sınıf İngilizce Portalı</span>
            </div>

            {/* Main Headline */}
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Ortaokul İngilizce Dersleri İçin <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600">Zengin Materyaller</span>
            </h1>

            {/* Subtitle / Short Description */}
            <p class="text-base sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              <strong class="text-slate-800">assisting.com</strong> ile 5, 6, 7 ve 8. sınıf İngilizce derslerinize özel çalışma kağıtları, LGS sınav stratejileri, ünite kelime kartları ve dijital oyunlara anında ulaşın.
            </p>

            {/* CTA Buttons */}
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('blog')}
                class="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 text-sm sm:text-base font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-full shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
              >
                <span>İngilizce Materyalleri Keşfet</span>
                <ArrowRight class="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('categories')}
                class="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 text-sm sm:text-base font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-full shadow-sm transition-all"
              >
                <Compass class="w-5 h-5 text-slate-500" />
                <span>Sınıf Seviyeleri (5-8)</span>
              </button>
            </div>

            {/* Quick Stats */}
            <div class="pt-8 grid grid-cols-4 gap-3 border-t border-slate-200/80 max-w-2xl mx-auto text-center">
              <div>
                <p class="text-xl sm:text-2xl font-black text-slate-900">5. Sınıf</p>
                <p class="text-xs text-slate-500 font-medium">Temel Kelimeler</p>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-black text-slate-900">6. Sınıf</p>
                <p class="text-xs text-slate-500 font-medium">Görsel Kartlar</p>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-black text-slate-900">7. Sınıf</p>
                <p class="text-xs text-slate-500 font-medium">Okuma & Konuşma</p>
              </div>
              <div>
                <p class="text-xl sm:text-2xl font-black text-slate-900">8. Sınıf</p>
                <p class="text-xs text-slate-500 font-medium">LGS Hazırlık</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      {featuredPosts.length > 0 && (
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-end justify-between mb-8">
            <div>
              <div class="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles class="w-4 h-4" />
                <span>Öne Çıkan Rehberler</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Öne Çıkan İngilizce Materyalleri</h2>
            </div>
            <button 
              onClick={() => onNavigate('blog')}
              class="hidden sm:flex items-center space-x-1 text-sm font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Tümünü Gör</span>
              <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <div class="space-y-6">
            {featuredPosts.slice(0, 2).map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onSelectPost={onSelectPost} 
                layout="featured" 
              />
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid (Sınıf Seviyeleri) */}
      <section class="bg-slate-100/70 py-12 border-y border-slate-200/80">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-10">
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">İçerik Kategorileri</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Sınıf Seviyeleri ve Materyal Alanları</h2>
            <p class="text-slate-600 text-sm mt-2">Ders vereceğiniz veya öğrendiğiniz sınıfa özel materyallere hızlıca ulaşın.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard 
                key={cat.id} 
                category={cat} 
                onSelectCategory={(id) => {
                  onSelectCategory(id);
                  onNavigate('blog');
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-8">
          <div>
            <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Son İçerikler</span>
            <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Son Eklenen İngilizce İçerikleri</h2>
          </div>
          <button 
            onClick={() => onNavigate('blog')}
            class="flex items-center space-x-1 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>Tüm Paylaşımlar ({posts.length})</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onSelectPost={onSelectPost} 
              layout="grid"
            />
          ))}
        </div>
      </section>

      {/* Banner for English Teachers */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          <div class="relative z-10 max-w-2xl space-y-4">
            <span class="px-3 py-1 bg-brand-500/30 border border-brand-400/40 rounded-full text-xs font-bold text-brand-200">
              assisting.com ELT Portal
            </span>
            
            <h2 class="text-2xl sm:text-4xl font-extrabold leading-tight">
              Ortaokul İngilizce Derslerinizi Eğlenceli ve Etkileşimli Hale Getirin
            </h2>

            <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
              5, 6, 7 ve 8. sınıf üniteleri için hazırladığımız hazır PDF çalışma kağıtları, Wordwall kelime oyunları ve ChatGPT promptları ile zamandan tasarruf edin.
            </p>

            <div class="pt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-300">
              <span class="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <CheckCircle class="w-4 h-4 text-emerald-400" />
                <span>MEB 5-8. Sınıf Müfredatına Tam Uyumlı</span>
              </span>
              <span class="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <CheckCircle class="w-4 h-4 text-emerald-400" />
                <span>LGS Sınav Soru Taktikleri</span>
              </span>
              <span class="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg">
                <CheckCircle class="w-4 h-4 text-emerald-400" />
                <span>Ücretsiz Yazdırılabilir (Printable) Materyaller</span>
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
