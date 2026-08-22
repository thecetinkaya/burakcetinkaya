# Burak Çetinkaya - Kıdemli Yazılımcı (Senior Developer) Standartları & Kuralları

Bu doküman, **burakcetinkaya-main** projesinde tüm geliştirme süreçlerinde uygulanacak kıdemli yazılımcı standartlarını, mimari kuralları ve istem (prompt) şablonlarını tanımlar.

---

## 🛠️ 1. Proje Mimarisi ve Teknoloji Yığını (Tech Stack)

- **Frontend**: React 18+ (Vite), JavaScript (ESNext) / JSDoc Type Annotations
- **Styling**: Tailwind CSS (Modern karanlık/aydınlık tema, cam efekti/glassmorphism, animasyonlar)
- **Veritabanı & Backend**: Supabase (PostgreSQL), Realtime & REST Client + LocalStorage Graceful Fallback
- **İkon & Grafikler**: Lucide React, React Icons, Recharts, Leaflet (Coğrafya Harita Modülü)
- **Modüler Yapı**:
  - `src/lib/supabase.js`: Tüm Supabase CRUD servisleri ve offline LocalStorage yedek katmanı.
  - `src/pages/admin/`: Admin paneli sekmeleri (`NotesTab`, `StockTab`, `KpssTab`, `DashboardTab`, `DenemeTakipTab` vb.).
  - `src/components/`: Yeniden kullanılabilir UI bileşenleri.

---

## 📐 2. Kod Kalitesi ve Temiz Kod (Clean Code) Standartları

1. **Defansif Programlama (Edge-Case Control)**:
   - Tüm obje erişimlerinde ve veri işlemelerinde `null`, `undefined`, `NaN` ve boş dizi kontrolleri yapılmalıdır (Örn: `data?.map()`, `parseFloat(val) || 0`).
2. **Supabase & Offline Güvenliği**:
   - Veritabanı sorgularında eksik kolon veya schema uyumsuzluğu (`PGRST204`) yaşandığında uygulama çökmemeli, otomatik fallback (sütun temizleme & retry) çalışmalıdır.
3. **Performans & React Optimization**:
   - Filtreleme ve ağır hesaplama işlemlerinde `useMemo`, callback fonksiyonlarında `useCallback` kullanılmalıdır.
   - Kullanıcı girdi ve arama işlemlerinde en az 300ms - 1500ms `debounce` uygulanmalıdır.
4. **İsimlendirme Standartları**:
   - Kod değişkenleri, fonksiyonlar ve hook'lar **İngilizce** ve anlamsal (semantic) olmalıdır (`handleSaveNote`, `filteredNotes`, `autoSaveStatus`).
   - Kullanıcı arayüzü metinleri ve bildirimler **Türkçe** olmalıdır.

---

## 📋 3. Projeye Özel Uyararlanmış "Senior Developer" Prompt Şablonları

### 1. Rol, Mimari ve Kurulum (Proje Başlangıcı & Özellik Mimarisı)
> *"Sen React, Vite, Tailwind CSS ve Supabase konusunda uzman kıdemli bir Full-Stack yazılımcısın. `burakcetinkaya-main` projemiz için `[Özellik Adı: Örn. KPSS Deneme Analiz Gelişmiş İstatistik Modülü]` geliştirmek istiyoruz. Bana bu özelliğin `src/pages/admin/` ve `src/lib/supabase.js` içindeki ölçeklenebilir klasör/dosya yapısını, state yönetimini ve veritabanı şemasını adım adım açıkla."*

### 2. İleri Seviye Hata Ayıklama (Advanced Debugging)
> *"Aşağıdaki `[Bileşen/Servis Adı]` kodunda `[Hata Metni: Örn. Could not find column in schema / PGRST204]` hatasını alıyorum. Bu hatanın kök nedenini (root cause) teknik olarak açıkla. Çözümü uygularken Supabase veritabanı ile LocalStorage fallback katmanı arasındaki uyumu koru ve uygulamanın çökmesini (crash) engelleyecek defansif kontrolleri ekle."*

### 3. Kod Kalitesi ve Refactoring (Temiz Kod & Performans)
> *"Aşağıdaki `[Bileşen Adı]` kodu çalışıyor ancak gereksiz render'lar yapıyor ve karmaşık durumda. Kodu SOLID ve Clean Code prensiplerine uygun olarak refactor et. Gereksiz re-render'ları önlemek için `useMemo` / `useCallback` yapılarını doğru kur, Büyük O (Big O) karmaşıklığını düşür ve değişken isimlerini tam anlamsal İngilizce terimlerle güncelle."*

### 4. Güvenlik, Uç Durum (Edge Case) ve Güçlendirme
> *"Bu `[Fonksiyon/Bileşen]` için olası tüm edge case'leri düşün: Kullanıcının bağlantısının kopması, Supabase'de sütunun bulunmaması, boş/geçersiz veri girilmesi veya aşırı hızlı tıklamalar (double submit). Sistemin çökmesini engelleyen guard clause'ları, XSS temizliğini ve rate limiting / debounce önlemlerini koda entegre et."*

### 5. Parçala ve Yönet (Kompleks Sorunlar İçin)
> *"Senden `[Karmaşık Özellik: Örn. Borsa Otomatik Al-Sat Sinyal Algoritması ve Portföy Takibi]` yazmanı istiyorum. Kodu doğrudan yazmaya başlama. Önce sorunu mantıksal alt bileşenlere ve fonksiyonlara bölen bir yol haritası (roadmap) sun. Ben onayladıktan sonra kodları parça parça ve test edilebilir şekilde geliştir."*

### 6. Master "4 Adım" Formülü (Her İstek İçin Standart)
> - **Bağlam (Context)**: "React + Vite + Tailwind CSS + Supabase kullanan `burakcetinkaya-main` admin panelinde çalışıyoruz."
> - **Görev (Task)**: "`[Not Defteri modülüne etiket bazlı renk filtreleme ve dışa aktarma özelliği eklenecek]`"
> - **Kısıtlamalar (Constraints)**: "Dışarıdan ek ağır kütüphane ekleme. Tailwind CSS kullan. Supabase bağlantısı koptuğunda LocalStorage fallback sorunsuz çalışsın."
> - **Çıktı Formatı**: "Önce uygulanacak mantığı kısaca özetle, ardından güncellenen dosyaları eksiksiz kod blokları halinde ver."
