import React from 'react';
import { Calendar, Clock, ArrowRight, Gamepad2, HardDrive, ExternalLink } from 'lucide-react';
import { CATEGORIES } from '../data/categories';

export default function PostCard({ post, onSelectPost, layout = 'grid' }) {
  const categoryInfo = CATEGORIES.find(c => c.name === post.category) || {
    bgColor: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  if (layout === 'featured') {
    return (
      <div 
        onClick={() => onSelectPost(post)}
        class="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0"
      >
        <div class="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden">
          <img 
            src={post.coverImage} 
            alt={post.title}
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          
          {/* Top badges */}
          <div class="absolute top-4 left-4 flex flex-wrap gap-2">
            <span class={`px-3 py-1.5 rounded-full text-xs font-bold border ${categoryInfo.bgColor} shadow-sm backdrop-blur-md`}>
              {post.category}
            </span>

            {post.driveLink && (
              <span class="px-2.5 py-1.5 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm flex items-center space-x-1">
                <HardDrive class="w-3.5 h-3.5" />
                <span>Drive Materyali</span>
              </span>
            )}

            {post.gameLink && (
              <span class="px-2.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm flex items-center space-x-1">
                <Gamepad2 class="w-3.5 h-3.5" />
                <span>Oyun</span>
              </span>
            )}
          </div>
        </div>

        <div class="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-center space-x-4 text-xs text-slate-500 mb-3">
              <span class="flex items-center space-x-1">
                <Calendar class="w-3.5 h-3.5" />
                <span>{post.date}</span>
              </span>
              <span>•</span>
              <span class="flex items-center space-x-1">
                <Clock class="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h3 class="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug mb-3">
              {post.title}
            </h3>

            <p class="text-slate-600 text-sm line-clamp-3 leading-relaxed mb-6">
              {post.summary}
            </p>
          </div>

          <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <img 
                src={post.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} 
                alt={post.author?.name} 
                class="w-9 h-9 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p class="text-xs font-bold text-slate-900">{post.author?.name}</p>
                <p class="text-[11px] text-slate-500 line-clamp-1">{post.author?.role}</p>
              </div>
            </div>

            <span class="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 group-hover:translate-x-1 transition-transform">
              <span>İncele & İndir</span>
              <ArrowRight class="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelectPost(post)}
      class="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
    >
      {/* Image */}
      <div class="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={post.coverImage} 
          alt={post.title}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Top Badges */}
        <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span class={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${categoryInfo.bgColor} shadow-sm backdrop-blur-md`}>
            {post.category}
          </span>
          
          {post.driveLink && (
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm flex items-center space-x-1">
              <HardDrive class="w-3 h-3" />
              <span>Drive</span>
            </span>
          )}

          {post.gameLink && (
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-sm flex items-center space-x-1">
              <Gamepad2 class="w-3 h-3" />
              <span>Oyun</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div class="flex items-center space-x-3 text-[11px] text-slate-500 mb-2.5">
            <span class="flex items-center space-x-1">
              <Calendar class="w-3 h-3 text-slate-400" />
              <span>{post.date}</span>
            </span>
            <span>•</span>
            <span class="flex items-center space-x-1">
              <Clock class="w-3 h-3 text-slate-400" />
              <span>{post.readTime}</span>
            </span>
          </div>

          <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug mb-2 line-clamp-2">
            {post.title}
          </h3>

          <p class="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
            {post.summary}
          </p>
        </div>

        {/* Author Footer */}
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div class="flex items-center space-x-2.5">
            <img 
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} 
              alt={post.author?.name} 
              class="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <span class="text-xs font-semibold text-slate-700 truncate max-w-[120px]">
              {post.author?.name}
            </span>
          </div>

          <span class="text-xs font-bold text-brand-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center space-x-1">
            <span>Devamı</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </span>
        </div>

      </div>
    </div>
  );
}
