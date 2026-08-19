# 🎓 assisting.com - Ortaokul İngilizce Materyalleri & Blog Portalı

**assisting.com**, 5, 6, 7 ve 8. sınıf İngilizce öğretmenleri ile LGS hazırlık öğrencileri için geliştirilmiş modern, hızlı, mobil uyumlu ve kullanıcı dostu bir eğitim materyali ve blog web sitesidir.

---

## 🌟 Öne Çıkan Özellikler

- 🏫 **5, 6, 7 & 8. Sınıf Seviyeleri:** MEB müfredatına %100 uyumlu ünite kelime kartları, LGS sınav taktikleri ve çalışma kağıtları.
- 🔤 **Linklendirmeli 26 Harfli İngiliz Alfabesi (A-Z):** Yalnızca İngiliz alfabesindeki 26 harfi (No Turkish-specific letters) barındıran anlık harf filtresi.
- 🎮 **İnteraktif Oyunlar:** Wordwall, Kahoot, Blooket ve Quizizz sınıf içi kelime oyunları için özel filtreleme ve başlatma bağlantıları.
- 📂 **Google Drive Materyal Bağlantıları:** Tek tıkla indirilebilir PDF çalışma kağıtları ve materyal klasörleri.
- 🔐 **Öğretmen Admin Paneli (`/admin`):** 
  - Güvenli Kullanıcı Adı & Şifre ile Giriş Sistemi (Kullanıcı Adı: `admin` | Şifre: `123456`).
  - Anlık Dashboard (Toplam Yazı ve Kategori İstatistikleri).
  - Blog Yazıları ve Materyal Ekleme, Düzenleme, Silme.
  - Kategori Yönetimi.
  - Tarayıcı Hafızası (LocalStorage) entegrasyonu.
- 🔄 **Tam Tarayıcı Geri/İleri & Yenileme Uyumlu:** HTML5 History API ile tarayıcının Geri (←), İleri (→) ve Yenile (F5) butonları kusursuz çalışır.

---

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **İkonlar:** Lucide React
- **State & Local Persistence:** HTML5 LocalStorage & History API

---

## 🚀 Projeyi Yerelde Çalıştırma

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirici sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   Uygulama `http://localhost:3000` adresinde çalışacaktır.

3. Production derlemesi alın:
   ```bash
   npm run build
   ```

---

## 🔐 Admin Paneli Giriş Bilgileri

- **Adres:** `http://localhost:3000/admin`
- **Kullanıcı Adı:** `admin`
- **Şifre:** `123456`
