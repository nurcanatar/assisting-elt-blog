import React, { useState } from 'react';
import { Search, Filter, X, Gamepad2, HardDrive, AlertCircle, Tag, Check, Type } from 'lucide-react';
import PostCard from '../components/PostCard';
import { CATEGORIES } from '../data/categories';

// Strictly 26 English Alphabet Letters (No Turkish letters: ç, ğ, ı, ö, ş, ü)
const ENGLISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

export default function BlogListPage({ 
  posts, 
  onSelectPost, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  setSearchQuery,
  filterType = 'all',
  setFilterType
}) {
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Find active category object if selected
  const activeCategoryObj = CATEGORIES.find(
    c => c.id === selectedCategory || c.name === selectedCategory
  );

  // Robust Filter logic including English Alphabet letter matching
  const filteredPosts = posts.filter(post => {
    let matchesCategory = true;
    if (selectedCategory) {
      matchesCategory = 
        post.categoryId === selectedCategory || 
        post.category === selectedCategory ||
        (activeCategoryObj && post.category === activeCategoryObj.name);
    }
    
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesType = true;
    if (filterType === 'games') matchesType = Boolean(post.gameLink);
    if (filterType === 'drive') matchesType = Boolean(post.driveLink);

    let matchesLetter = true;
    if (selectedLetter) {
      const letterUpper = selectedLetter.toUpperCase();
      const titleUpper = post.title.toUpperCase();
      const summaryUpper = post.summary.toUpperCase();
      
      matchesLetter = 
        titleUpper.startsWith(letterUpper) ||
        titleUpper.split(/[\s,.-]+/).some(word => word.startsWith(letterUpper)) ||
        summaryUpper.split(/[\s,.-]+/).some(word => word.startsWith(letterUpper));
    }

    return matchesCategory && matchesSearch && matchesType && matchesLetter;
  });

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-brand-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div class="relative z-10 max-w-2xl space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-brand-500/20 text-brand-300 text-xs font-bold rounded-full border border-brand-400/30 uppercase tracking-wider">
              assisting.com ELT Archive
            </span>
            {(selectedCategory || selectedLetter) && (
              <span class="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30">
                Filtre Aktif
              </span>
            )}
          </div>

          <h1 class="text-3xl sm:text-4xl font-black tracking-tight">
            {selectedLetter ? `🔤 Alphabet Filter: Letter "${selectedLetter}"` : (
              selectedCategory && activeCategoryObj ? `📂 ${activeCategoryObj.name}` : (
                filterType === 'games' ? '🎮 İnteraktif Oyunlar & Kelime Kartları' :
                filterType === 'drive' ? '📂 Google Drive Materyal Arşivi' :
                '5, 6, 7 ve 8. Sınıf İngilizce Materyalleri'
              )
            )}
          </h1>

          <p class="text-slate-300 text-sm sm:text-base leading-relaxed">
            {selectedLetter ? `Showing English materials and vocabulary resources associated with the letter "${selectedLetter}".` : (
              selectedCategory && activeCategoryObj ? activeCategoryObj.description : (
                filterType === 'games' ? 'Akıllı tahta ve öğrenci telefonlarında oynatabileceğiniz hazır Wordwall, Kahoot, Blooket ve Quizizz setleri.' :
                filterType === 'drive' ? '5, 6, 7 ve 8. sınıf İngilizce dersleri için ücretsiz indirilebilir Google Drive PDF çalışma kağıtları.' :
                'Dersiniz için çalışma kağıtları, Google Drive klasörleri, Wordwall kelime oyunları ve LGS soru pratiklerini filtreleyin.'
              )
            )}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div class="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Top Controls: Search Input & Type Buttons */}
        <div class="flex flex-col md:flex-row items-center gap-4">
          <div class="relative w-full flex-1">
            <input
              type="text"
              placeholder="Ünite, kelime veya İngilizce konusu ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              class="w-full pl-10 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
            />
            <Search class="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                class="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X class="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Special Type Filter Buttons (All, Games, Drive) */}
          <div class="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => { setFilterType('all'); setSelectedLetter(null); }}
              class={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                filterType === 'all' && !selectedLetter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>

            <button
              onClick={() => { setFilterType('games'); setSelectedLetter(null); }}
              class={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                filterType === 'games'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Gamepad2 class="w-3.5 h-3.5" />
              <span>🎮 Oyunlar</span>
            </button>

            <button
              onClick={() => { setFilterType('drive'); setSelectedLetter(null); }}
              class={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                filterType === 'drive'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <HardDrive class="w-3.5 h-3.5" />
              <span>📂 Drive Materyalleri</span>
            </button>
          </div>
        </div>

        {/* 🔤 LINKLENDİRMELİ İNGİLİZ ALFABESİ (ENGLISH ALPHABET A-Z) */}
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
            <div class="flex items-center space-x-1.5">
              <Type class="w-4 h-4 text-indigo-600" />
              <span>English Alphabet Index (A-Z):</span>
            </div>
            {selectedLetter && (
              <button
                onClick={() => setSelectedLetter(null)}
                class="text-xs font-bold text-rose-600 hover:text-rose-800 underline flex items-center space-x-1"
              >
                <span>Alphabet Filtresini Kaldır ("{selectedLetter}")</span>
                <X class="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 26 English Alphabet Buttons (A to Z) */}
          <div class="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setSelectedLetter(null)}
              class={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedLetter === null
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              All (A-Z)
            </button>

            {ENGLISH_ALPHABET.map((letter) => {
              const isSelected = selectedLetter === letter;
              return (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(isSelected ? null : letter)}
                  class={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md scale-110'
                      : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                  }`}
                  title={`Letter ${letter}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filter Pills (Sınıf Seviyeleri ve Kategoriler) */}
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
            <div class="flex items-center space-x-1 text-slate-700">
              <Tag class="w-3.5 h-3.5 text-brand-600" />
              <span>Sınıf / Kategoriye Göre Filtrele:</span>
            </div>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                class="text-brand-600 hover:text-brand-800 font-bold underline flex items-center space-x-1"
              >
                <span>Filtreyi Temizle</span>
                <X class="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div class="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory(null)}
              class={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === null
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tüm Kategoriler ({posts.length})
            </button>

            {CATEGORIES.map((cat) => {
              const count = posts.filter(
                p => p.categoryId === cat.id || p.category === cat.name
              ).length;
              const isSelected = selectedCategory === cat.id || selectedCategory === cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                  class={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20 scale-105'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span class={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Active Category / Alphabet Filter Info Bar */}
      {(selectedCategory || selectedLetter) && (
        <div class="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center justify-between animate-fade-in">
          <div class="flex items-center space-x-2 text-xs text-indigo-900 font-bold">
            <Check class="w-4 h-4 text-indigo-600" />
            <span>
              {selectedLetter && `[Harf: "${selectedLetter}"] `}
              {selectedCategory && activeCategoryObj && `[Kategori: "${activeCategoryObj.name}"] `}
              filitresi ile {filteredPosts.length} içerik listeleniyor.
            </span>
          </div>

          <button
            onClick={() => { setSelectedCategory(null); setSelectedLetter(null); }}
            class="px-3 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-300 shadow-sm transition-colors"
          >
            Filtreleri Temizle ✕
          </button>
        </div>
      )}

      {/* Post Grid */}
      {filteredPosts.length > 0 ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onSelectPost={onSelectPost} 
              layout="grid"
            />
          ))}
        </div>
      ) : (
        <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle class="w-8 h-8" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">
            {selectedLetter ? `"${selectedLetter}" Harfi İle Başlayan İçerik Bulunamadı` : 'Aramanıza Uygun İçerik Bulunamadı'}
          </h3>
          <p class="text-sm text-slate-500">
            Farklı bir harf seçebilir veya filtreleri temizleyerek tüm İngilizce içeriklerine erişebilirsiniz.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
              setSelectedLetter(null);
              setFilterType('all');
            }}
            class="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
          >
            Tüm Filtreleri Sıfırla
          </button>
        </div>
      )}

    </div>
  );
}
