#!/bin/bash

# LimpiApp - PostgreSQL Database Setup Script
# This script creates and initializes the LimpiApp database

set -e  # Exit on error

echo "🚀 LimpiApp Database Setup Script"
echo "=================================="
echo ""

# Configuration
DB_NAME="${DB_NAME:-limpiapp_dev}"
DB_USER="${DB_USER:-limpiapp}"
DB_PASSWORD="${DB_PASSWORD:-limpiapp123}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if PostgreSQL is running
echo "Checking PostgreSQL connection..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    print_error "PostgreSQL is not running on $DB_HOST:$DB_PORT"
    echo ""
    echo "To start PostgreSQL:"
    echo "  - Docker: docker-compose up -d"
    echo "  - Mac: brew services start postgresql"
    echo "  - Linux: sudo systemctl start postgresql"
    exit 1
fi
print_success "PostgreSQL is running"

# Check if database exists
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -w $DB_NAME | wc -l)

if [ $DB_EXISTS -eq 1 ]; then
    print_warning "Database '$DB_NAME' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping database '$DB_NAME'..."
        dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER --if-exists $DB_NAME
        print_success "Database dropped"
    else
        print_warning "Using existing database"
        echo ""
        read -p "Do you want to run migrations anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 0
        fi
    fi
fi

# Create database if it doesn't exist
if [ $DB_EXISTS -eq 0 ]; then
    echo "Creating database '$DB_NAME'..."
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    print_success "Database '$DB_NAME' created"
fi

# Run initial schema
echo ""
echo "Running initial schema migration..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../prisma/migrations/001_initial_schema.sql

if [ $? -eq 0 ]; then
    print_success "Schema migration completed"
else
    print_error "Schema migration failed"
    exit 1
fi

# Ask if user wants to seed data
echo ""
read -p "Do you want to seed the database with sample data? (Y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Nn]$ ]]; then
    echo "Seeding database with sample data..."
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f ../prisma/seed.sql

    if [ $? -eq 0 ]; then
        print_success "Database seeded successfully"
    else
        print_error "Seeding failed"
        exit 1
    fi
fi

# Print summary
echo ""
echo "=================================="
echo "✅ Database Setup Complete!"
echo "=================================="
echo ""
echo "Database Details:"
echo "  Name: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo ""
echo "Connection String:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "Next Steps:"
echo "  1. Update your .env file with the connection string"
echo "  2. Run: npm run dev"
echo "  3. Test API: curl http://localhost:3000/health"
echo ""
echo "Sample Users Created:"
echo "  Admin:      admin@limpiapp.com (password: admin123)"
echo "  Client:     maria.lopez@example.com (password: password123)"
echo "  Housekeeper: ana.garcia@example.com (password: password123)"
echo ""
