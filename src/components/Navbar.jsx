import React, { useState } from 'react';
import { Menu, X, Search, Sparkles, BookOpenCheck, Settings, Gamepad2, HardDrive } from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  filterType,
  setFilterType
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'blog', label: 'Materyaller & Blog' },
    { id: 'categories', label: 'Sınıf Seviyeleri' },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2, badgeColor: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'drive', label: 'Drive Materyalleri', icon: HardDrive, badgeColor: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'about', label: 'Hakkında' },
    { id: 'contact', label: 'İletişim' }
  ];

  const handleNavClick = (itemId) => {
    if (itemId === 'games') {
      if (setFilterType) setFilterType('games');
      if (setSelectedCategory) setSelectedCategory(null);
      setActivePage('blog');
    } else if (itemId === 'drive') {
      if (setFilterType) setFilterType('drive');
      if (setSelectedCategory) setSelectedCategory(null);
      setActivePage('blog');
    } else {
      if (setFilterType && (itemId === 'blog' || itemId === 'home')) setFilterType('all');
      setActivePage(itemId);
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine active item state
  const isItemActive = (itemId) => {
    if (itemId === 'games') return activePage === 'blog' && filterType === 'games';
    if (itemId === 'drive') return activePage === 'blog' && filterType === 'drive';
    if (itemId === 'blog') return activePage === 'blog' && filterType === 'all' && !selectedCategory;
    return activePage === itemId;
  };

  return (
    <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo: assisting.com */}
          <div 
            onClick={() => handleNavClick('home')} 
            class="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <BookOpenCheck class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <span class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-brand-600 transition-colors">
                  assisting<span class="text-brand-600">.com</span>
                </span>
                <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-brand-50 text-brand-700 border border-brand-200 rounded-full hidden sm:inline-block">
                  5-8. Sınıf ELT
                </span>
              </div>
              <p class="text-[11px] text-slate-500 hidden lg:block font-medium">Ortaokul İngilizce Materyalleri & Öğretmen Portalı</p>
            </div>
          </div>

          {/* Desktop Nav Links (Includes Oyunlar & Drive) */}
          <nav class="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const active = isItemActive(item.id);
              const IconComp = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  class={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1.5 transition-all ${
                    active
                      ? 'bg-brand-50 text-brand-700 shadow-sm border border-brand-200'
                      : item.badgeColor
                      ? `${item.badgeColor} hover:shadow-sm border`
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {IconComp && <IconComp class="w-4 h-4" />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Admin Link */}
            <button
              onClick={() => handleNavClick('admin')}
              class="px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-indigo-600 hover:bg-indigo-50 flex items-center space-x-1 transition-all border border-indigo-100"
              title="Öğretmen Admin Paneli"
            >
              <Settings class="w-4 h-4 text-indigo-500" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action & Search */}
          <div class="hidden sm:flex items-center space-x-2">
            <div class="relative">
              <input
                type="text"
                placeholder="Materyal veya oyun ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'blog') setActivePage('blog');
                }}
                class="w-36 md:w-44 lg:w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Mobile Right Controls */}
          <div class="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              class="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Arama"
            >
              <Search class="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              class="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X class="w-6 h-6" /> : <Menu class="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div class="lg:hidden py-3 border-t border-slate-100">
            <div class="relative">
              <input
                type="text"
                placeholder="5, 6, 7, 8. sınıf materyali veya oyun ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'blog') setActivePage('blog');
                }}
                class="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                autoFocus
              />
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        )}

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div class="lg:hidden bg-white border-b border-slate-200 shadow-xl px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navItems.map((item) => {
            const active = isItemActive(item.id);
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                class={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold flex items-center space-x-2 transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {IconComp && <IconComp class="w-5 h-5" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => handleNavClick('admin')}
            class="w-full text-left px-4 py-3 rounded-xl text-base font-bold text-indigo-600 bg-indigo-50 flex items-center space-x-2 border border-indigo-100"
          >
            <Settings class="w-5 h-5" />
            <span>Admin Paneli</span>
          </button>
        </div>
      )}
    </header>
  );
}
