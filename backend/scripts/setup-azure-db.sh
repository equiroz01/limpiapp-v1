#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 LimpiApp - Azure PostgreSQL Database Setup"
echo "=============================================="
echo ""

# Load environment variables
if [ -f ../.env ]; then
    export $(cat ../.env | grep -v '^#' | xargs)
else
    echo -e "${RED}❌ Error: .env file not found${NC}"
    exit 1
fi

# Extract connection details
DB_HOST="rc-hyper-server-03.postgres.database.azure.com"
DB_PORT="5432"
DB_USER="sqlragiadmin"
DB_PASSWORD="./R4g0012025"
DB_NAME="limpia_app_db"

echo "📋 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   User: $DB_USER"
echo "   Database: $DB_NAME"
echo ""

# Test connection
echo "🔌 Testing connection to Azure PostgreSQL..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT version();" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Connection successful!${NC}"
else
    echo -e "${RED}❌ Connection failed!${NC}"
    echo ""
    echo "Possible issues:"
    echo "1. Check if your IP is whitelisted in Azure PostgreSQL firewall"
    echo "2. Verify the password is correct"
    echo "3. Check if SSL is required (Azure PostgreSQL requires SSL)"
    echo ""
    echo "To whitelist your IP in Azure:"
    echo "1. Go to Azure Portal"
    echo "2. Navigate to your PostgreSQL server"
    echo "3. Go to 'Connection security'"
    echo "4. Add your current IP address"
    echo ""
    exit 1
fi

echo ""
echo "🗄️  Checking if database is empty..."
TABLE_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ "$TABLE_COUNT" -eq "0" ]; then
    echo -e "${YELLOW}⚠️  Database is empty. Running migrations...${NC}"
    echo ""

    # Run migration script
    echo "📝 Creating schema..."
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ../prisma/migrations/001_initial_schema.sql

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Schema created successfully!${NC}"
    else
        echo -e "${RED}❌ Error creating schema${NC}"
        exit 1
    fi

    echo ""
    read -p "Do you want to seed the database with sample data? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f ../prisma/seed.sql

        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Database seeded successfully!${NC}"
        else
            echo -e "${RED}❌ Error seeding database${NC}"
            exit 1
        fi
    fi
else
    echo -e "${GREEN}✅ Database already has $TABLE_COUNT tables${NC}"
fi

echo ""
echo "📊 Database Statistics:"
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
    schemaname,
    tablename,
    n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;
"

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the backend server: npm run dev"
echo "2. Test the API: curl http://localhost:3000/api/v1/health"
echo ""
