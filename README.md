# 🎓 assisting.com - Ortaokul İngilizce Materyalleri & Öğretmen-Öğrenci Portalı

**assisting.com**, 5, 6, 7 ve 8. sınıf İngilizce öğretmenleri ile LGS hazırlık öğrencileri için geliştirilmiş modern, hızlı, mobil uyumlu ve kullanıcı dostu bir eğitim materyali, yönetim ve blog portalıdır.

---

## 🌟 Öne Çıkan Özellikler

### 👩‍🏫 1. Tek Yönetici Öğretmen Masası (`nurcanelci` / `123456`)
- **Yıllık Planlar & Müfredat Modülleri:** 5, 6, 7 ve 8. sınıf MEB İngilizce ünite kazanımları, haftalık hedefler ve ders modülleri.
- **Öğrenci Takibi & Aktivite Geçmişi Denetimi:** Kayıtlı öğrencilerin sitede oynadığı oyunlar, çözdüğü testler ve aldığı skorların **yalnızca öğretmen tarafından** görüntülenebildiği denetim masası.
- **Ödev Yönetimi & 100 Üzerinden Puanlama:** Tüm sınıfa veya seçili öğrencilere ödev gönderme; teslim edilen ödevleri puanlayıp kişisel geri bildirim ile öğrenciye geri iletme.
- **Merkezi Denetimli Mesajlaşma:** Öğretmenin öğrencilerle birebir yazışması ve öğrenciler arasındaki tüm sohbetleri güvenlik amacıyla denetleyebilmesi.
- **Canlı Sınıf Araçları:** Geri sayım sayacı (sesli uyarı), rastgele öğrenci seçici (çark), hızlı sınav notu hesaplayıcı ve haftalık ders programı tablosu.

### 🎒 2. Öğrenci Portalı & Çalışma Alanı
- **Hızlı Kayıt ve Giriş:** Yalnızca **kullanıcı adı** ve **şifre** ile anında hesap açma.
- **Ödevlerim & Öğretmen Dönütleri:** Öğretmenin gönderdiği ödevleri yanıtlama, verilen puanı ve öğretmenin özel notunu görüntüleme.
- **Günün Kelimesi & Sesli Telaffuz:** Web Speech API ile anında doğru İngilizce telaffuzu dinleme.
- **İnteraktif Alıştırmalar & Oyunlar:** Günün 5 soruluk mini testi (skor otomatik olarak öğretmenin ekranına kaydedilir), çevrilebilir kelime kartları, Wordwall & Kahoot bağlantıları.
- **Pomodoro Odaklanma Sayacı:** 25 dakika ders + 5 dakika mola sayacı.

### 🗄️ 3. Kalıcı Veri Tabanı Mimarisi
- `users`, `activities`, `messages`, `homeworks`, `submissions`, `teacher_plans` tabloları ile ilişkisel veri modeli.
- Veri kaybını önleyen yerel tarayıcı kalıcılığı ve tek tıkla **JSON Veri Tabanı Yedekleme / Geri Yükleme**.

---

## 🔐 Giriş Bilgileri

- **👩‍🏫 Öğretmen (Yönetici) Girişi:**
  - Kullanıcı Adı: `nurcanelci`
  - Şifre: `123456`
- **🎒 Öğrenci Girişi & Kayıt:**
  - Kullanıcı adı ve şifre belirleyerek anında kayıt olunabilir veya demo öğrencilerle test edilebilir:
    - Kullanıcı Adı: `zeynep_y` | Şifre: `123456`
    - Kullanıcı Adı: `ali_kaya` | Şifre: `123456`
- **⚙️ Blog Admin Paneli:**
  - Adres: `/admin` | Kullanıcı Adı: `admin` | Şifre: `123456`

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 18, Vite 5, Tailwind CSS 3
- **İkonlar:** Lucide React
- **Ses & Multimedya:** Web Speech Synthesis API, Web Audio API
- **State & Database:** Persistent Relational Client Database (LocalStorage & JSON Backup)
- **Deployment:** GitHub Pages & GitHub Actions

---

## 🚀 Projeyi Yerelde Çalıştırma

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın
npm run dev

# Canlı derleme (build) alın
npm run build
```
