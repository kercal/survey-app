# Survey App - Anket Uygulaması

Multi-tenant anket uygulaması. Kolayik platformunda iframe olarak çalışır ve PostMessage ile iletişim kurar.

## Özellikler

- 🎯 Multi-tenant mimari
- 📊 Çoktan seçmeli, açık uçlu, puanlama ve evet/hayır soruları
- 👥 Admin ve kullanıcı rolleri
- 📈 Canlı sonuç görüntüleme (sadece adminler için)
- 📥 Excel export (sadece adminler için)
- 🔒 PostMessage ile güvenli iframe iletişimi
- 💾 PostgreSQL veritabanı

## Teknolojiler

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **UI**: Tailwind CSS, Radix UI
- **Export**: ExcelJS

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install --legacy-peer-deps
```

### 2. Veritabanı Kurulumu

PostgreSQL'in yüklü ve çalışır durumda olduğundan emin olun.

```bash
# .env dosyasını oluştur
cp env.template .env

# .env dosyasını düzenle ve DATABASE_URL'i güncelle
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/survey_app?schema=public"
```

### 3. Veritabanı Migration

```bash
# Prisma client oluştur
npx prisma generate

# Migration çalıştır
npm run db:migrate

# Örnek veri ekle (opsiyonel)
npm run db:seed
```

### 4. Uygulamayı Başlat

```bash
npm run dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

## Test Verisi

Seed script çalıştırıldığında aşağıdaki test verisi oluşturulur:

- **Tenant ID**: `tenant-test-123`
- **Admin Person ID**: `person-admin-456`
- **Normal User Person ID**: `person-user-789`

## PostMessage API

Uygulama iframe içinde çalışır ve parent window ile PostMessage ile iletişim kurar.

### Parent Window'dan Gönderilecek Veri

```javascript
{
  tenantID: "tenant-test-123",
  personID: "person-admin-456",
  personName: "Ahmet Yılmaz", // Opsiyonel
  bearerToken: "..." // Opsiyonel
}
```

### Örnek Parent HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Survey App Test</title>
</head>
<body>
    <h1>Survey App Parent Window</h1>
    <button id="sendData">Send Data to Iframe</button>
    
    <iframe 
        id="surveyFrame"
        src="http://localhost:3000?app=http://localhost:8080"
        width="100%"
        height="800px"
        style="border: 1px solid #ccc; margin-top: 20px;">
    </iframe>

    <script>
        const iframe = document.getElementById('surveyFrame');
        
        // Listen for ready signal
        window.addEventListener('message', function(event) {
            if (event.origin !== 'http://localhost:3000') return;
            
            try {
                const data = JSON.parse(event.data);
                if (data.isReady) {
                    console.log('✅ Iframe is ready!');
                    // Auto-send data when ready
                    sendDataToIframe();
                }
            } catch (e) {}
        });

        function sendDataToIframe() {
            const data = {
                tenantID: "tenant-test-123",
                personID: "person-admin-456", // Try: person-user-789 for non-admin
                personName: "Test User",
                bearerToken: "test-token"
            };

            iframe.contentWindow.postMessage(
                JSON.stringify(data),
                'http://localhost:3000'
            );
            console.log('📤 Data sent to iframe:', data);
        }

        document.getElementById('sendData').addEventListener('click', sendDataToIframe);
    </script>
</body>
</html>
```

## Veritabanı Şeması

### Tenants
- Şirket/firma bilgileri

### Categories
- Anket kategorileri (Mutluluk, Restoran, vb.)

### Questions
- Sorular ve tipleri
- Desteklenen tipler: `multiple_choice`, `free_text`, `rating`, `yes_no`

### AdminUsers
- Tenant'a özel admin kullanıcı listesi

### Responses
- Kullanıcı cevapları

## API Endpoints

### GET /api/survey
Tenant için anket verilerini getirir
- Query params: `tenantId`, `personId`
- Response: categories, isAdmin, responses

### POST /api/response
Soru cevabını kaydeder
- Body: `questionId`, `tenantId`, `personId`, `personName`, `answerValue`

### GET /api/results
Anket sonuçlarını getirir (sadece adminler)
- Query params: `tenantId`, `personId`
- Response: results, statistics

### GET /api/export
Sonuçları Excel olarak indirir (sadece adminler)
- Query params: `tenantId`, `personId`
- Response: Excel file

## Geliştirme

### Prisma Studio
```bash
npm run db:studio
```

### Yeni Migration
```bash
npm run db:migrate
```

### Seed Script
```bash
npm run db:seed
```

## Üretim

```bash
npm run build
npm start
```

## Lisans

Private
