import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Adding more survey categories...')

  const tenantId = 'tenant-test-123'

  // 1. İş Ortamı Değerlendirme
  const workEnv = await prisma.category.create({
    data: {
      tenantId,
      name: 'İş Ortamı Değerlendirme',
      description: 'Çalışma ortamı ve koşulları hakkında geri bildirim',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: workEnv.id,
        tenantId,
        questionText: 'Çalışma alanınız yeterince aydınlatılmış mı?',
        questionType: 'yes_no',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: workEnv.id,
        tenantId,
        questionText: 'Ofis sıcaklığı konforunu nasıl değerlendirirsiniz?',
        questionType: 'rating',
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: workEnv.id,
        tenantId,
        questionText: 'Çalışma ortamında iyileştirilmesi gereken alanlar nelerdir?',
        questionType: 'free_text',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ İş Ortamı Değerlendirme')

  // 2. Teknoloji ve Ekipman
  const tech = await prisma.category.create({
    data: {
      tenantId,
      name: 'Teknoloji ve Ekipman',
      description: 'IT altyapısı ve donanım değerlendirmesi',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: tech.id,
        tenantId,
        questionText: 'Bilgisayarınızın performansından memnun musunuz?',
        questionType: 'yes_no',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: tech.id,
        tenantId,
        questionText: 'Hangi teknolojik ekipmana ihtiyacınız var?',
        questionType: 'multiple_choice',
        options: ['İkinci Monitör', 'Kablosuz Mouse', 'Mekanik Klavye', 'Laptop Stand', 'Kulaklık'],
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: tech.id,
        tenantId,
        questionText: 'İnternet bağlantı hızını değerlendirin',
        questionType: 'rating',
        isRequired: true,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Teknoloji ve Ekipman')

  // 3. Takım Çalışması
  const teamwork = await prisma.category.create({
    data: {
      tenantId,
      name: 'Takım Çalışması',
      description: 'Ekip içi iletişim ve işbirliği',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: teamwork.id,
        tenantId,
        questionText: 'Ekip içi iletişimi nasıl değerlendirirsiniz?',
        questionType: 'rating',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: teamwork.id,
        tenantId,
        questionText: 'Departmanlar arası işbirliği yeterli mi?',
        questionType: 'yes_no',
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: teamwork.id,
        tenantId,
        questionText: 'Takım çalışmasını iyileştirmek için önerileriniz nelerdir?',
        questionType: 'free_text',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Takım Çalışması')

  // 4. Eğitim ve Gelişim
  const training = await prisma.category.create({
    data: {
      tenantId,
      name: 'Eğitim ve Gelişim',
      description: 'Kişisel ve mesleki gelişim fırsatları',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: training.id,
        tenantId,
        questionText: 'Hangi konuda eğitim almak istersiniz?',
        questionType: 'multiple_choice',
        options: ['Teknik Beceriler', 'Liderlik', 'İletişim', 'Proje Yönetimi', 'Yabancı Dil'],
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: training.id,
        tenantId,
        questionText: 'Eğitim imkanlarından memnun musunuz?',
        questionType: 'rating',
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: training.id,
        tenantId,
        questionText: 'Kariyer gelişiminiz için şirket yeterli destek sağlıyor mu?',
        questionType: 'yes_no',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Eğitim ve Gelişim')

  // 5. Uzaktan Çalışma
  const remote = await prisma.category.create({
    data: {
      tenantId,
      name: 'Uzaktan Çalışma',
      description: 'Hibrit çalışma modeli değerlendirmesi',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: remote.id,
        tenantId,
        questionText: 'Uzaktan çalışma imkanından faydalanıyor musunuz?',
        questionType: 'yes_no',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: remote.id,
        tenantId,
        questionText: 'Haftada kaç gün uzaktan çalışmak istersiniz?',
        questionType: 'multiple_choice',
        options: ['0 gün (Tam ofis)', '1-2 gün', '3 gün', '4-5 gün (Çoğunlukla uzaktan)'],
        isRequired: true,
        isActive: true,
        order: 2
      },
      {
        categoryId: remote.id,
        tenantId,
        questionText: 'Uzaktan çalışma araçları yeterli mi?',
        questionType: 'rating',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Uzaktan Çalışma')

  // 6. Sosyal Aktiviteler
  const social = await prisma.category.create({
    data: {
      tenantId,
      name: 'Sosyal Aktiviteler',
      description: 'Şirket içi sosyal etkinlikler ve organizasyonlar',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: social.id,
        tenantId,
        questionText: 'Hangi sosyal aktiviteleri tercih edersiniz?',
        questionType: 'multiple_choice',
        options: ['Spor Etkinlikleri', 'Sinema/Tiyatro', 'Kahvaltı/Yemek', 'Oyun Turnuvaları', 'Açık Hava Aktiviteleri'],
        isRequired: false,
        isActive: true,
        order: 1
      },
      {
        categoryId: social.id,
        tenantId,
        questionText: 'Sosyal etkinlik sıklığını yeterli buluyor musunuz?',
        questionType: 'yes_no',
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: social.id,
        tenantId,
        questionText: 'Düzenlemek istediğiniz etkinlik öneriniz var mı?',
        questionType: 'free_text',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Sosyal Aktiviteler')

  // 7. Sağlık ve Wellness
  const health = await prisma.category.create({
    data: {
      tenantId,
      name: 'Sağlık ve Wellness',
      description: 'Çalışan sağlığı ve wellness programları',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: health.id,
        tenantId,
        questionText: 'Hangi wellness hizmetlerinden faydalanmak istersiniz?',
        questionType: 'multiple_choice',
        options: ['Spor Salonu Üyeliği', 'Yoga/Pilates', 'Psikolojik Danışmanlık', 'Masaj/Fizik Tedavi', 'Beslenme Danışmanlığı'],
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: health.id,
        tenantId,
        questionText: 'İş-yaşam dengenizden memnun musunuz?',
        questionType: 'rating',
        isRequired: true,
        isActive: true,
        order: 2
      },
      {
        categoryId: health.id,
        tenantId,
        questionText: 'Stres seviyenizi düşürmek için önerileriniz?',
        questionType: 'free_text',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Sağlık ve Wellness')

  // 8. İletişim Kanalları
  const communication = await prisma.category.create({
    data: {
      tenantId,
      name: 'İletişim Kanalları',
      description: 'Şirket içi iletişim araçları ve etkinliği',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: communication.id,
        tenantId,
        questionText: 'En çok hangi iletişim kanalını kullanıyorsunuz?',
        questionType: 'multiple_choice',
        options: ['E-posta', 'Slack/Teams', 'Yüz yüze toplantı', 'Telefon', 'Video konferans'],
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: communication.id,
        tenantId,
        questionText: 'Yönetimden bilgi akışı yeterli mi?',
        questionType: 'yes_no',
        isRequired: false,
        isActive: true,
        order: 2
      },
      {
        categoryId: communication.id,
        tenantId,
        questionText: 'İletişim araçlarının etkinliğini değerlendirin',
        questionType: 'rating',
        isRequired: true,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ İletişim Kanalları')

  // 9. Performans Değerlendirme
  const performance = await prisma.category.create({
    data: {
      tenantId,
      name: 'Performans Değerlendirme',
      description: 'Performans yönetimi ve geri bildirim süreci',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: performance.id,
        tenantId,
        questionText: 'Performans değerlendirme sürecini adil buluyor musunuz?',
        questionType: 'yes_no',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: performance.id,
        tenantId,
        questionText: 'Yöneticinizden aldığınız geri bildirimi değerlendirin',
        questionType: 'rating',
        isRequired: true,
        isActive: true,
        order: 2
      },
      {
        categoryId: performance.id,
        tenantId,
        questionText: 'Performans değerlendirme sisteminde nelerin değişmesini istersiniz?',
        questionType: 'free_text',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Performans Değerlendirme')

  // 10. Çalışma Saatleri
  const workHours = await prisma.category.create({
    data: {
      tenantId,
      name: 'Çalışma Saatleri',
      description: 'Mesai saatleri ve esneklik',
      isActive: true
    }
  })

  await prisma.question.createMany({
    data: [
      {
        categoryId: workHours.id,
        tenantId,
        questionText: 'Esnek çalışma saatleri uygulamasını destekliyor musunuz?',
        questionType: 'yes_no',
        isRequired: true,
        isActive: true,
        order: 1
      },
      {
        categoryId: workHours.id,
        tenantId,
        questionText: 'İdeal çalışma saati modeliniz nedir?',
        questionType: 'multiple_choice',
        options: ['Standart (09:00-18:00)', 'Esnek Giriş-Çıkış', 'Vardiya Sistemi', 'Part-time', 'Proje Bazlı'],
        isRequired: true,
        isActive: true,
        order: 2
      },
      {
        categoryId: workHours.id,
        tenantId,
        questionText: 'Mesai saatleri düzenlemesini değerlendirin',
        questionType: 'rating',
        isRequired: false,
        isActive: true,
        order: 3
      }
    ]
  })
  console.log('✅ Çalışma Saatleri')

  console.log('\n🎉 10 additional categories added successfully!')
  console.log('📊 Total categories: 12 (2 original + 10 new)')
}

main()
  .catch((e) => {
    console.error('❌ Error adding categories:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

