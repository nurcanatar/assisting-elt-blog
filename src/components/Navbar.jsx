import React, { useState } from 'react';
import { 
  Menu, X, Search, Sparkles, BookOpenCheck, Settings, Gamepad2, 
  HardDrive, GraduationCap, User, LogOut, ShieldCheck, UserPlus
} from 'lucide-react';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory,
  filterType,
  setFilterType,
  currentUser,
  onOpenAuth,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { 
      id: 'teacher', 
      label: 'Öğretmen Masası', 
      icon: GraduationCap, 
      badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 font-extrabold' 
    },
    { 
      id: 'student', 
      label: 'Öğrenci Portalı', 
      icon: Sparkles, 
      badgeColor: 'text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100 font-extrabold' 
    },
    { id: 'blog', label: 'Materyaller' },
    { id: 'categories', label: 'Sınıflar (5-8)' },
    { id: 'games', label: 'Oyunlar', icon: Gamepad2, badgeColor: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'drive', label: 'Drive', icon: HardDrive, badgeColor: 'text-blue-600 bg-blue-50 border-blue-200' },
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

          {/* Desktop Nav Links */}
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
              class="px-2.5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 flex items-center space-x-1 transition-all"
              title="Blog Yazı Yönetimi"
            >
              <Settings class="w-3.5 h-3.5 text-slate-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action: Search + User Auth State */}
          <div class="hidden sm:flex items-center space-x-3">
            
            {/* Search Input */}
            <div class="relative">
              <input
                type="text"
                placeholder="Materyal ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activePage !== 'blog') setActivePage('blog');
                }}
                class="w-32 md:w-36 lg:w-40 pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all"
              />
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            {/* Auth Button or User Badge */}
            {currentUser ? (
              <div class="flex items-center space-x-2 bg-slate-100 p-1.5 pl-3 rounded-full border border-slate-200 text-xs">
                {currentUser.role === 'teacher' ? (
                  <span 
                    onClick={() => handleNavClick('teacher')}
                    class="font-extrabold text-indigo-700 cursor-pointer hover:underline flex items-center space-x-1"
                  >
                    <span>👩‍🏫 Nurcan Elçi</span>
                  </span>
                ) : (
                  <span 
                    onClick={() => handleNavClick('student')}
                    class="font-bold text-slate-800 cursor-pointer hover:underline flex items-center space-x-1"
                  >
                    <span>🎒 @{currentUser.username}</span>
                    <span class="text-[10px] text-slate-400">({currentUser.grade}. Sınıf)</span>
                  </span>
                )}
                
                <button
                  onClick={onLogout}
                  class="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded-full transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut class="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth('student-login')}
                class="px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-full text-xs font-bold shadow-sm shadow-brand-500/20 transition-all flex items-center space-x-1.5"
              >
                <User class="w-3.5 h-3.5" />
                <span>Giriş / Kayıt</span>
              </button>
            )}

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
          
          {/* Mobile User Header */}
          {currentUser ? (
            <div class="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-xl">{currentUser.role === 'teacher' ? '👩‍🏫' : '🎒'}</span>
                <div>
                  <p class="text-xs font-black text-slate-900">{currentUser.name || currentUser.username}</p>
                  <p class="text-[10px] text-slate-400">
                    {currentUser.role === 'teacher' ? 'Yönetici Öğretmen' : `@${currentUser.username} (${currentUser.grade}. Sınıf)`}
                  </p>
                </div>
              </div>
              <button
                onClick={onLogout}
                class="px-2.5 py-1 bg-white border border-slate-200 text-rose-600 rounded-xl text-xs font-bold"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <div class="grid grid-cols-2 gap-2 mb-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('student-login'); }}
                class="py-2.5 bg-brand-600 text-white rounded-xl text-xs font-bold text-center shadow-sm"
              >
                Öğrenci Girişi
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth('teacher-login'); }}
                class="py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold text-center shadow-sm"
              >
                Öğretmen Girişi
              </button>
            </div>
          )}

          {navItems.map((item) => {
            const active = isItemActive(item.id);
            const IconComp = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                class={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center space-x-2 transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 border-l-4 border-brand-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {IconComp && <IconComp class="w-4 h-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={() => handleNavClick('admin')}
            class="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-slate-500 bg-slate-50 flex items-center space-x-2 border border-slate-200"
          >
            <Settings class="w-4 h-4" />
            <span>Admin Blog Yönetimi</span>
          </button>
        </div>
      )}
    </header>
  );
}
