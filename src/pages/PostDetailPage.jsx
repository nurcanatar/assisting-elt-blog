import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Share2, Check, ThumbsUp, Tag, ShieldCheck, HardDrive, Gamepad2, ExternalLink, Download } from 'lucide-react';
import PostCard from '../components/PostCard';
import { CATEGORIES } from '../data/categories';

export default function PostDetailPage({ post, allPosts, onSelectPost, onBack, fromAdmin = false }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(24);

  if (!post) return null;

  const categoryInfo = CATEGORIES.find(c => c.name === post.category) || {
    bgColor: 'bg-brand-50 text-brand-700 border-brand-200'
  };

  // Find related posts in same category
  const relatedPosts = allPosts
    .filter(p => p.id !== post.id && p.categoryId === post.categoryId)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  return (
    <article class="py-10 pb-16">
      
      {/* Container */}
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Preview Notice */}
        {fromAdmin && (
          <div class="bg-indigo-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg border border-indigo-700">
            <div class="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
              <ShieldCheck class="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Yazı Önizleme Modundasınız (Admin Panelinden Görüntüleniyor)</span>
            </div>
            <button
              onClick={onBack}
              class="px-4 py-1.5 bg-white text-indigo-900 text-xs font-bold rounded-xl hover:bg-slate-100 shadow-sm"
            >
              Admin Paneline Dön ↩
            </button>
          </div>
        )}

        {/* Navigation & Header Actions */}
        <div class="flex items-center justify-between">
          <button
            onClick={onBack}
            class="inline-flex items-center space-x-2 text-sm font-bold text-slate-700 hover:text-brand-600 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm transition-all hover:bg-slate-50"
          >
            <ArrowLeft class="w-4 h-4 text-slate-500" />
            <span>{fromAdmin ? 'Admin Paneline Dön' : 'Tüm Yazılara Dön'}</span>
          </button>

          <div class="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              class="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm hover:bg-slate-50"
              title="Bağlantıyı Kopyala"
            >
              {copied ? <Check class="w-4 h-4 text-emerald-500" /> : <Share2 class="w-4 h-4" />}
              <span>{copied ? 'Kopyalandı!' : 'Paylaş'}</span>
            </button>
          </div>
        </div>

        {/* Post Header Information */}
        <header class="space-y-6">
          
          {/* Category Badge & Meta */}
          <div class="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span class={`px-3 py-1 rounded-full border font-bold ${categoryInfo.bgColor}`}>
              {post.category}
            </span>
            <span class="text-slate-400">•</span>
            <span class="flex items-center space-x-1 text-slate-500">
              <Calendar class="w-4 h-4 text-slate-400" />
              <span>{post.date}</span>
            </span>
            <span class="text-slate-400">•</span>
            <span class="flex items-center space-x-1 text-slate-500">
              <Clock class="w-4 h-4 text-slate-400" />
              <span>{post.readTime}</span>
            </span>
          </div>

          {/* Article Main Title */}
          <h1 class="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author Card Header */}
          <div class="flex items-center space-x-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <img 
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'} 
              alt={post.author?.name} 
              class="w-12 h-12 rounded-full object-cover border-2 border-brand-500/20"
            />
            <div class="flex-1">
              <h4 class="text-sm font-bold text-slate-900">{post.author?.name || 'Öğretmen'}</h4>
              <p class="text-xs text-slate-500">{post.author?.role || 'İngilizce Öğretmeni'}</p>
            </div>
            <div class="hidden sm:block text-right">
              <span class="text-[11px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Doğrulanmış İçerik
              </span>
            </div>
          </div>

        </header>

        {/* Action Callout Boxes: Google Drive & Interactive Games */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Google Drive Material Download Box */}
          {post.driveLink ? (
            <div class="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-700/60 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
                  <HardDrive class="w-4 h-4 text-blue-400" />
                  <span>Google Drive Materyalleri</span>
                </div>
                <h3 class="text-lg font-extrabold text-white leading-snug">
                  Ders PDF & Çalışma Kağıtları
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Bu içeriğe ait tüm yazdırılabilir çalışma kağıtları Google Drive klasöründe ücretsiz erişime açıktır.
                </p>
              </div>

              <a
                href={post.driveLink}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                <Download class="w-4 h-4" />
                <span>Google Drive'da İndir / Aç</span>
                <ExternalLink class="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>
          ) : (
            <div class="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex items-center space-x-3 text-slate-500">
              <HardDrive class="w-6 h-6 text-slate-400 shrink-0" />
              <div class="text-xs">
                <p class="font-bold text-slate-700">Google Drive Bağlantısı</p>
                <p>Bu yazıya henüz Drive materyali eklenmedi.</p>
              </div>
            </div>
          )}

          {/* Interactive Digital Game Box */}
          {post.gameLink ? (
            <div class="bg-gradient-to-br from-rose-900 to-purple-950 text-white rounded-2xl p-6 shadow-md border border-rose-700/60 flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <div class="flex items-center space-x-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                  <Gamepad2 class="w-4 h-4 text-rose-400" />
                  <span>İnteraktif Sınıf Oyunu</span>
                </div>
                <h3 class="text-lg font-extrabold text-white leading-snug">
                  Wordwall / Kahoot Kelime Oyunu
                </h3>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Akıllı tahtada veya öğrenci telefonlarında oynatabileceğiniz hazır kelime yarışması.
                </p>
              </div>

              <a
                href={post.gameLink}
                target="_blank"
                rel="noopener noreferrer"
                class="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                <Gamepad2 class="w-4 h-4" />
                <span>Oyunu Sınıfta Başlat 🎮</span>
                <ExternalLink class="w-3.5 h-3.5 ml-1 opacity-80" />
              </a>
            </div>
          ) : (
            <div class="bg-slate-100 rounded-2xl p-6 border border-slate-200 flex items-center space-x-3 text-slate-500">
              <Gamepad2 class="w-6 h-6 text-slate-400 shrink-0" />
              <div class="text-xs">
                <p class="font-bold text-slate-700">İnteraktif Oyun Bağlantısı</p>
                <p>Bu içeriğe dijital oyun bağlantısı eklenebilir.</p>
              </div>
            </div>
          )}

        </div>

        {/* Post Cover Image */}
        <div class="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/9] bg-slate-100">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            class="w-full h-full object-cover"
          />
        </div>

        {/* Main Article Content */}
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
          
          <div 
            class="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Interaction Bar */}
          <div class="mt-10 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-3">
              <button
                onClick={handleLike}
                class={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  liked
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp class={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>Beğen ({likeCount})</span>
              </button>
            </div>

            <div class="flex items-center space-x-2 text-xs text-slate-500">
              <Tag class="w-4 h-4 text-brand-600" />
              <span>Etiketler:</span>
              <span class="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-700">#Ortaokul</span>
              <span class="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-700">#{post.category}</span>
              <span class="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-700">#assisting</span>
            </div>
          </div>

        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div class="pt-8 border-t border-slate-200 space-y-6">
            <h3 class="text-2xl font-bold text-slate-900">Benzer İngilizce Materyalleri</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(p => (
                <PostCard 
                  key={p.id} 
                  post={p} 
                  onSelectPost={onSelectPost} 
                  layout="grid" 
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </article>
  );
}
