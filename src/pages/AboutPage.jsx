import React from 'react';
import { Target, ShieldCheck, Sparkles, BookOpenCheck, Award } from 'lucide-react';

export default function AboutPage() {
  const team = [
    {
      name: 'Öğr. Elif Yılmaz',
      role: 'Kurucu & Ortaokul ELT İçerik Direktörü',
      bio: '10 yıllık Ortaokul İngilizce Öğretmeni ve LGS Koordinatörü. 8. sınıf LGS İngilizce soru çözümleri ve 7. sınıf okuma materyalleri hazırlamaktadır.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Öğr. Kaan Öztürk',
      role: 'Dijital Materyal & Oyun Editörü',
      bio: 'Ortaokul İngilizce Öğretmeni. 5 ve 6. sınıflar için Wordwall kelime oyunları, görsel flashcardlar ve Canva ders sunumları hazırlamaktadır.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Header */}
      <div class="text-center max-w-3xl mx-auto space-y-4">
        <span class="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 uppercase tracking-wider">
          assisting.com Hakkında
        </span>
        <h1 class="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Ortaokul İngilizce Öğretmenlerinin Dijital Materyal Deposu
        </h1>
        <p class="text-slate-600 text-base sm:text-lg leading-relaxed">
          <strong>assisting.com</strong>, ortaokul (5, 6, 7 ve 8. sınıf) İngilizce öğretmenlerinin ders hazırlık süreçlerini kolaylaştırmak, öğrencilerin yabancı dil sevgisini artırmak ve LGS İngilizce sınavında tam net yapmalarını desteklemek amacıyla kurulmuş bağımsız bir e-öğrenme ve materyal platformudur.
        </p>
      </div>

      {/* Value Pillars */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <Target class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">5-8. Sınıf Müfredatına Uyumlu</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Milli Eğitim Bakanlığı ortaokul İngilizce ders kitabı üniteleri ve kazanımları ile birebir eşleşen güncel içerikler.
          </p>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Sparkles class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">LGS İngilizce Odaklı</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            8. sınıf öğrencileri için diyalog tamamlama, grafik okuma ve çeldiricisi yüksek LGS soru kalıplarına yönelik özel rehberler.
          </p>
        </div>

        <div class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck class="w-6 h-6" />
          </div>
          <h3 class="text-xl font-bold text-slate-900">Ücretsiz & Yazdırılabilir (Printable)</h3>
          <p class="text-slate-600 text-sm leading-relaxed">
            Tüm çalışma kağıtları, kelime flashcardları ve oyun şablonları öğretmenlerimizin sınıf kullanımı için tamamen ücretsizdir.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div class="space-y-8 pt-8 border-t border-slate-200">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs font-bold text-brand-600 uppercase tracking-wider">Ekibimiz</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Ortaokul İngilizce Öğretmenleri</h2>
          <p class="text-slate-600 text-sm">assisting.com içeriklerini hazırlayan deneyimli ELT kadromuz.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {team.map((member, i) => (
            <div key={i} class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
              <img 
                src={member.avatar} 
                alt={member.name} 
                class="w-24 h-24 rounded-full object-cover mx-auto border-4 border-brand-100 shadow-md"
              />
              <div>
                <h4 class="text-lg font-bold text-slate-900">{member.name}</h4>
                <p class="text-xs font-bold text-brand-600 mb-2">{member.role}</p>
                <p class="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
