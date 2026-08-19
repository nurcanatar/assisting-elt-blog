import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'İngilizce Materyal Talebi', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'assisting.com sitesindeki İngilizce materyalleri sınıfta yazdırıp kullanabilir miyim?',
      a: 'Evet! assisting.com üzerindeki tüm 5, 6, 7 ve 8. sınıf İngilizce çalışma kağıtları, kelime kartları (flashcards) ve LGS denemeleri öğretmenlerin ticari olmayan sınıf içi kullanımı için tamamen ücretsizdir.'
    },
    {
      q: 'Hazırladığım İngilizce materyalleri veya çalışma kağıtlarını sitede yayınlatabilir miyim?',
      a: 'Tabii ki! İngilizce öğretmenleri topluluğumuza katkıda bulunmak isterseniz hazırladığınız PDF veya görsel materyalleri info@assisting.com adresine gönderebilirsiniz. İncelendikten sonra adınızla yayınlarız.'
    },
    {
      q: 'LGS İngilizce soru kalıpları 2026 MEB müfredatı ile uyumlu mu?',
      a: 'Evet, 8. sınıf LGS kategorisindeki tüm soru çözümleri, grafik okuma pratikleri ve 10 ünite kelime kartları MEB müfredatındaki en güncel ünite kazanımlarına göre hazırlanmaktadır.'
    },
    {
      q: 'Wordwall ve Kahoot oyun linklerine nasıl erişebilirim?',
      a: 'İlgili ünite blog yazısının içerisinde yer alan "Oyun Linki" butonlarına tıklayarak doğrudan sınıfınızda akıllı tahtada oynatabilirsiniz.'
    }
  ];

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div class="text-center max-w-2xl mx-auto space-y-3">
        <span class="px-3.5 py-1.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200 uppercase tracking-wider">
          assisting.com İletişim
        </span>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900">Bizimle İletişime Geçin</h1>
        <p class="text-slate-600 text-sm sm:text-base">
          5-8. sınıf İngilizce materyal talepleriniz, LGS soru önerileriniz veya görüşleriniz için formu doldurabilirsiniz.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Contact Form */}
        <div class="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <h2 class="text-2xl font-bold text-slate-900">Mesaj Gönderin</h2>

          {submitted ? (
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4 animate-fade-in">
              <div class="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold text-emerald-900">Mesajınız Alındı!</h3>
              <p class="text-sm text-emerald-800 leading-relaxed">
                Değerli İngilizce Öğretmenim, mesajınız tarafımıza ulaştı. En kısa sürede e-posta adresiniz üzerinden sizinle iletişime geçeceğiz.
              </p>
              <button
                onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: 'İngilizce Materyal Talebi', message: '' }); }}
                class="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Yeni Mesaj Gönder
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">Adınız Soyadınız *</label>
                  <input
                    type="text"
                    required
                    placeholder="Elif Yılmaz"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">E-posta Adresiniz *</label>
                  <input
                    type="email"
                    required
                    placeholder="elt.teacher@meb.k12.tr"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Konu</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                >
                  <option value="İngilizce Materyal Talebi">İngilizce Materyal Talebi (5-8. Sınıf)</option>
                  <option value="LGS Soru & Kelime Önerisi">LGS Soru & Kelime Önerisi</option>
                  <option value="İçerik Yayınlatma">Materyal / İçerik Yayınlatma</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">Mesajınız *</label>
                <textarea
                  required
                  rows="5"
                  placeholder="İhtiyacınız olan sınıf seviyesini veya materyal talebinizi buraya yazabilirsiniz..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  class="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
                ></textarea>
              </div>

              <button
                type="submit"
                class="w-full flex items-center justify-center space-x-2 py-3.5 px-6 font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all hover:shadow-lg"
              >
                <Send class="w-4 h-4" />
                <span>Mesajı Gönder</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Quick Info Cards */}
        <div class="lg:col-span-5 space-y-6">
          
          <div class="bg-gradient-to-br from-brand-900 to-indigo-950 text-white p-8 rounded-3xl space-y-4 shadow-lg">
            <h3 class="text-xl font-bold flex items-center space-x-2">
              <Mail class="w-5 h-5 text-brand-400" />
              <span>Doğrudan İletişim</span>
            </h3>
            <p class="text-slate-300 text-sm leading-relaxed">
              Ortaokul İngilizce materyalleri, LGS soru bankaları ve önerileriniz için e-posta adresimiz üzerinden bize ulaşabilirsiniz.
            </p>
            <div class="pt-2">
              <a href="mailto:info@assisting.com" class="text-brand-300 hover:text-white font-bold text-sm underline">
                info@assisting.com
              </a>
            </div>
          </div>

          {/* Socials / Community Card */}
          <div class="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 shadow-sm">
            <h3 class="text-lg font-bold text-slate-900">İngilizce Öğretmenleri Topluluğumuz</h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              5, 6, 7 ve 8. sınıf güncel ünite kelime kartları ve Wordwall oyun linkleri için bizi sosyal medyada takip edebilirsiniz.
            </p>
            <div class="flex flex-wrap gap-2 text-xs font-semibold">
              <span class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">Twitter / X @assisting</span>
              <span class="px-3 py-1.5 bg-pink-50 text-pink-700 rounded-lg border border-pink-200">Instagram @assisting_elt</span>
              <span class="px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200">YouTube / AssistingELT</span>
            </div>
          </div>

        </div>

      </div>

      {/* FAQ Section */}
      <div class="pt-12 border-t border-slate-200 space-y-8">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <div class="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <HelpCircle class="w-4 h-4" />
            <span>Merak Edilenler</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-slate-900">Sıkça Sorulan Sorular</h2>
        </div>

        <div class="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                class="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-sm text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown class={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {openFaq === idx && (
                <div class="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
