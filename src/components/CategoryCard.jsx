import React from 'react';
import { FileText, Laptop, Sparkles, HeartHandshake, Gamepad2, ArrowRight } from 'lucide-react';

const iconMap = {
  FileText: FileText,
  Laptop: Laptop,
  Sparkles: Sparkles,
  HeartHandshake: HeartHandshake,
  Gamepad2: Gamepad2
};

export default function CategoryCard({ category, onSelectCategory }) {
  const IconComponent = iconMap[category.icon] || FileText;

  return (
    <div 
      onClick={() => onSelectCategory(category.id)}
      class="group cursor-pointer bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        <div class="flex items-center justify-between mb-4">
          <div class={`w-12 h-12 rounded-xl bg-gradient-to-tr ${category.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
            <IconComponent class="w-6 h-6" />
          </div>
          <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            {category.count} İçerik
          </span>
        </div>

        <h3 class="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {category.name}
        </h3>

        <p class="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">
          {category.description}
        </p>
      </div>

      <div class="flex items-center justify-between text-xs font-bold text-brand-600 pt-3 border-t border-slate-100 group-hover:text-brand-700">
        <span>Yazıları İncele</span>
        <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
