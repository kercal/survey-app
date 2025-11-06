# Survey App - Kurulum Rehberi

## ✅ Tamamlanan İşlemler

Survey uygulaması başarıyla oluşturuldu! Aşağıdaki bileşenler hazır:

- ✅ Next.js TypeScript projesi
- ✅ PostgreSQL + Prisma ORM yapılandırması
- ✅ Veritabanı şeması (migrations)
- ✅ API endpoints (survey, response, results, export)
- ✅ PostMessage iletişim sistemi
- ✅ Anket formu ve soru tipleri
- ✅ Admin paneli ve sonuç görüntüleme
- ✅ Excel export özelliği
- ✅ Test HTML dosyası (test-parent.html)

## 🚀 Başlamak İçin

### 1. PostgreSQL Kurulumu ve Başlatma

PostgreSQL'in kurulu olması gerekiyor. Kurulu değilse:

**macOS (Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**PostgreSQL hizmetinin çalıştığını kontrol edin:**
```bash
psql postgres
```

### 2. Veritabanı Oluşturma (Opsiyonel)

PostgreSQL'e bağlandıktan sonra:
```sql
CREATE DATABASE survey_app;
\q
```

### 3. Migration ve Seed

```bash
cd /Users/kerem/projects/solution-scripts/mini_apps/survey-app

# Prisma client oluştur (tekrar)
npx prisma generate

# Migration çalıştır (veritabanını oluştur)
npx prisma migrate dev --name init

# Örnek veri ekle
npm run db:seed
```

Başarılı olursa şu çıktıyı göreceksiniz:
```
✅ Tenant created: Test Şirketi
✅ Admin user created: Admin User
✅ Category created: Mutluluk Anketi
✅ Category created: Ofis Restoran Anketi
✅ Questions created for Happiness category
✅ Questions created for Restaurant category
✅ Sample responses created
🎉 Seed completed successfully!
```

### 4. Uygulamayı Başlat

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacak.

### 5. Test Parent Window'u Başlat

Ayrı bir terminal penceresinde basit bir HTTP sunucusu başlatın:

```bash
# Python 3
cd /Users/kerem/projects/solution-scripts/mini_apps/survey-app
python3 -m http.server 8080
```

veya

```bash
# Node.js (npx http-server kuruluysa)
npx http-server -p 8080
```

Sonra tarayıcıda açın:
http://localhost:8080/test-parent.html

## 🧪 Test Senaryoları

### Test Kullanıcıları (Seed'den)

1. **Admin Kullanıcı**
   - Tenant ID: `tenant-test-123`
   - Person ID: `person-admin-456`
   - Özellik: "Sonuçlar" sekmesini görebilir

2. **Normal Kullanıcı**
   - Tenant ID: `tenant-test-123`
   - Person ID: `person-user-789`
   - Özellik: Sadece anket formunu görebilir

### Test Adımları

1. `test-parent.html` dosyasını tarayıcıda açın
2. "Admin User" veya "Normal User" seçin
3. "📤 Veri Gönder" butonuna tıklayın
4. Iframe içinde survey app yüklenecek

**Admin olarak:**
- İki sekme göreceksiniz: "Anket" ve "Sonuçlar"
- Sonuçlar sekmesinde istatistikler ve Excel indirme butonu

**Normal kullanıcı olarak:**
- Sadece anket formunu göreceksiniz
- Sorulara cevap verebilirsiniz

## 📊 Prisma Studio (Veritabanı Yönetimi)

Veritabanını görsel olarak yönetmek için:

```bash
npm run db:studio
```

http://localhost:5555 adresinde açılacak.

Buradan:
- Yeni tenant ekleyebilirsiniz
- Kategoriler oluşturabilirsiniz
- Sorular ekleyebilirsiniz
- Admin kullanıcıları tanımlayabilirsiniz
- Cevapları görebilirsiniz

## 🔧 Sorun Giderme

### PostgreSQL bağlanamıyor
```bash
# PostgreSQL çalışıyor mu kontrol et
brew services list | grep postgresql

# Çalışmıyorsa başlat
brew services start postgresql@15
```

### Port 3000 kullanımda
```bash
# Farklı portta başlat
PORT=3001 npm run dev
```

### Migration hatası
```bash
# Veritabanını sıfırla (DİKKAT: Tüm veriler silinir!)
npx prisma migrate reset

# Seed tekrar çalıştır
npm run db:seed
```

## 📁 Proje Yapısı

```
survey-app/
├── app/
│   ├── api/              # API routes
│   │   ├── survey/       # Anket verilerini getir
│   │   ├── response/     # Cevap kaydet
│   │   ├── results/      # Sonuçları getir (admin)
│   │   └── export/       # Excel export (admin)
│   ├── components/       # React components
│   │   ├── DataWaiting.tsx      # PostMessage handler
│   │   ├── SurveyForm.tsx       # Anket formu
│   │   └── ResultsPanel.tsx     # Admin sonuç paneli
│   ├── survey/           # Survey route
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── components/ui/        # UI components (Button, Card, etc.)
├── lib/                  # Libraries
│   └── prisma.ts        # Prisma client
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed script
└── test-parent.html     # Test için parent window
```

## 🎯 Sonraki Adımlar

1. PostgreSQL'i başlat
2. Migration çalıştır
3. Seed ile test verisi ekle
4. Uygulamayı test et
5. Kendi tenant ve sorularınızı ekleyin!

## 💡 İpuçları

- Prisma Studio'yu kullanarak kolayca veri yönetimi yapabilirsiniz
- test-parent.html üzerinden farklı kullanıcılarla test yapabilirsiniz
- Excel export işlevi için sonuçlar sayfasına gitmeniz gerekir
- Her soru tipi için farklı görselleştirmeler mevcuttur

## 🐛 Bilinen Sorunlar

Herhangi bir hata durumunda:
1. Browser console'u kontrol edin
2. Terminal'deki Next.js loglarını inceleyin
3. Prisma Studio'dan veritabanını kontrol edin

