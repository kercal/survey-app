import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a test tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-test-123' },
    update: {},
    create: {
      id: 'tenant-test-123',
      name: 'Test Şirketi',
      description: 'Test amaçlı örnek şirket'
    }
  })
  console.log('✅ Tenant created:', tenant.name)

  // Create admin user
  const adminUser = await prisma.adminUser.upsert({
    where: {
      tenantId_personId: {
        tenantId: tenant.id,
        personId: 'person-admin-456'
      }
    },
    update: {},
    create: {
      tenantId: tenant.id,
      personId: 'person-admin-456',
      name: 'Admin User'
    }
  })
  console.log('✅ Admin user created:', adminUser.name)

  // Create categories
  const happinessCategory = await prisma.category.upsert({
    where: { id: 'cat-happiness' },
    update: {},
    create: {
      id: 'cat-happiness',
      tenantId: tenant.id,
      name: 'Mutluluk Anketi',
      description: 'Çalışan memnuniyeti ve mutluluk düzeyini ölçen sorular',
      isActive: true
    }
  })
  console.log('✅ Category created:', happinessCategory.name)

  const restaurantCategory = await prisma.category.upsert({
    where: { id: 'cat-restaurant' },
    update: {},
    create: {
      id: 'cat-restaurant',
      tenantId: tenant.id,
      name: 'Ofis Restoran Anketi',
      description: 'Ofis yemek hizmetleri hakkında geri bildirim',
      isActive: true
    }
  })
  console.log('✅ Category created:', restaurantCategory.name)

  // Create questions for happiness category
  await prisma.question.upsert({
    where: { id: 'q-happiness-1' },
    update: {},
    create: {
      id: 'q-happiness-1',
      categoryId: happinessCategory.id,
      tenantId: tenant.id,
      questionText: 'Şirketin mevcut durumuyla ilgili ne kadar mutlusunuz?',
      questionType: 'rating',
      isRequired: true,
      isActive: true,
      order: 1
    }
  })

  await prisma.question.upsert({
    where: { id: 'q-happiness-2' },
    update: {},
    create: {
      id: 'q-happiness-2',
      categoryId: happinessCategory.id,
      tenantId: tenant.id,
      questionText: 'İş-yaşam dengenizden memnun musunuz?',
      questionType: 'yes_no',
      isRequired: false,
      isActive: true,
      order: 2
    }
  })

  await prisma.question.upsert({
    where: { id: 'q-happiness-3' },
    update: {},
    create: {
      id: 'q-happiness-3',
      categoryId: happinessCategory.id,
      tenantId: tenant.id,
      questionText: 'Şirkette ne tür iyileştirmeler yapılmasını istersiniz?',
      questionType: 'free_text',
      isRequired: false,
      isActive: true,
      order: 3
    }
  })
  console.log('✅ Questions created for Happiness category')

  // Create questions for restaurant category
  await prisma.question.upsert({
    where: { id: 'q-restaurant-1' },
    update: {},
    create: {
      id: 'q-restaurant-1',
      categoryId: restaurantCategory.id,
      tenantId: tenant.id,
      questionText: 'Hangi yemeği en çok seversiniz?',
      questionType: 'multiple_choice',
      options: ['Tavuk', 'Et', 'Balık', 'Vejeteryan', 'Vegan'],
      isRequired: true,
      isActive: true,
      order: 1
    }
  })

  await prisma.question.upsert({
    where: { id: 'q-restaurant-2' },
    update: {},
    create: {
      id: 'q-restaurant-2',
      categoryId: restaurantCategory.id,
      tenantId: tenant.id,
      questionText: 'Yemek kalitesini nasıl değerlendirirsiniz?',
      questionType: 'rating',
      isRequired: true,
      isActive: true,
      order: 2
    }
  })

  await prisma.question.upsert({
    where: { id: 'q-restaurant-3' },
    update: {},
    create: {
      id: 'q-restaurant-3',
      categoryId: restaurantCategory.id,
      tenantId: tenant.id,
      questionText: 'Menüde görmek istediğiniz yemekler nelerdir?',
      questionType: 'free_text',
      isRequired: false,
      isActive: true,
      order: 3
    }
  })
  console.log('✅ Questions created for Restaurant category')

  // Create some sample responses
  await prisma.response.upsert({
    where: {
      questionId_personId: {
        questionId: 'q-happiness-1',
        personId: 'person-user-789'
      }
    },
    update: {},
    create: {
      questionId: 'q-happiness-1',
      tenantId: tenant.id,
      personId: 'person-user-789',
      personName: 'Ahmet Yılmaz',
      answerValue: '4'
    }
  })

  await prisma.response.upsert({
    where: {
      questionId_personId: {
        questionId: 'q-happiness-2',
        personId: 'person-user-789'
      }
    },
    update: {},
    create: {
      questionId: 'q-happiness-2',
      tenantId: tenant.id,
      personId: 'person-user-789',
      personName: 'Ahmet Yılmaz',
      answerValue: 'Evet'
    }
  })

  await prisma.response.upsert({
    where: {
      questionId_personId: {
        questionId: 'q-restaurant-1',
        personId: 'person-user-789'
      }
    },
    update: {},
    create: {
      questionId: 'q-restaurant-1',
      tenantId: tenant.id,
      personId: 'person-user-789',
      personName: 'Ahmet Yılmaz',
      answerValue: 'Tavuk'
    }
  })
  console.log('✅ Sample responses created')

  console.log('🎉 Seed completed successfully!')
  console.log('\n📝 Test Data:')
  console.log(`   Tenant ID: ${tenant.id}`)
  console.log(`   Admin Person ID: person-admin-456`)
  console.log(`   Regular User Person ID: person-user-789`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

