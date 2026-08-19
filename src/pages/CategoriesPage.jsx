import React from 'react';
import { CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import PostCard from '../components/PostCard';
import { Compass, Sparkles } from 'lucide-react';

export default function CategoriesPage({ posts, onSelectPost, selectedCategory, setSelectedCategory, onNavigate }) {

  const activeCategoryObj = CATEGORIES.find(c => c.id === selectedCategory);
  const categoryPosts = selectedCategory 
    ? posts.filter(p => p.categoryId === selectedCategory)
    : [];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <div class="inline-flex items-center space-x-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold border border-brand-200">
          <Compass class="w-4 h-4 text-brand-600" />
          <span>Kategori Dizini</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">Eğitim Konuları ve Alanlar</h1>
        <p class="text-slate-600 text-sm sm:text-base">
          Öğretmenlik uzmanlık alanınıza veya ihtiyacınıza uygun kategoriyi seçerek yayınlanan materyallere hızlıca ulaşın.
        </p>
      </div>

      {/* Categories Cards Grid */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            onSelectCategory={(id) => {
              setSelectedCategory(id);
              // scroll to posts section
              setTimeout(() => {
                document.getElementById('category-posts-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
          />
        ))}
      </div>

      {/* Selected Category Posts Preview Section */}
      {selectedCategory && activeCategoryObj && (
        <div id="category-posts-section" class="pt-8 border-t border-slate-200 space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Seçili Kategori</span>
              <h2 class="text-2xl font-extrabold text-slate-900">{activeCategoryObj.name} Yazıları</h2>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              class="text-xs font-bold text-slate-500 hover:text-slate-800 underline"
            >
              Filtreyi Kaldır
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryPosts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onSelectPost={onSelectPost} 
                layout="grid"
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
