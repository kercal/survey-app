#!/bin/bash

# Survey App Quick Start Script

echo "🚀 Survey App - Quick Start"
echo "================================"
echo ""

# Check if PostgreSQL is running
echo "📊 Checking PostgreSQL..."
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running on localhost:5432"
    echo ""
    echo "Please start PostgreSQL first:"
    echo "  brew services start postgresql@15"
    echo "  OR"
    echo "  pg_ctl -D /usr/local/var/postgres start"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Test Data:"
echo "  Tenant ID: tenant-test-123"
echo "  Admin Person ID: person-admin-456"
echo "  User Person ID: person-user-789"
echo ""
echo "🎯 Next steps:"
echo "  1. Start the app: npm run dev"
echo "  2. In another terminal, start test server:"
echo "     python3 -m http.server 8080"
echo "  3. Open: http://localhost:8080/test-parent.html"
echo ""
echo "📖 For more info, see SETUP.md"

