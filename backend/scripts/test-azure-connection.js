#!/usr/bin/env node

/**
 * Test Azure PostgreSQL Connection using psql command
 * This script tests the connection to Azure PostgreSQL database
 */

const { execSync } = require('child_process');

// Connection details
const DB_HOST = "rc-hyper-server-03.postgres.database.azure.com";
const DB_PORT = "5432";
const DB_USER = "sqlragiadmin";
const DB_PASSWORD = "./R4g0012025";
const DB_NAME = "limpia_app_db";

console.log('🔌 Testing Azure PostgreSQL Connection\n');
console.log('📋 Configuration:');
console.log(`   Host: ${DB_HOST}`);
console.log(`   Port: ${DB_PORT}`);
console.log(`   User: ${DB_USER}`);
console.log(`   Database: ${DB_NAME}\n`);

// Set environment variable for password
process.env.PGPASSWORD = DB_PASSWORD;

try {
  console.log('🔌 Attempting connection...\n');

  // Test connection with version query
  const versionCommand = `psql -h "${DB_HOST}" -p ${DB_PORT} -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT version();" -t`;
  const version = execSync(versionCommand, { encoding: 'utf-8' });

  console.log('✅ Connection successful!\n');
  console.log('📊 PostgreSQL Version:');
  console.log(version.trim());
  console.log('');

  // Check tables
  console.log('📋 Checking tables...\n');
  const tablesCommand = `psql -h "${DB_HOST}" -p ${DB_PORT} -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT schemaname, tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" -t`;
  const tables = execSync(tablesCommand, { encoding: 'utf-8' });

  const tableLines = tables.trim().split('\n').filter(line => line.trim());

  if (tableLines.length === 0) {
    console.log('⚠️  No tables found. Database is empty.\n');
    console.log('To create the schema, run:');
    console.log('  npm run setup:db\n');
  } else {
    console.log('Tables found:');
    tableLines.forEach(line => {
      const tableName = line.split('|')[1]?.trim();
      if (tableName) {
        console.log(`   - ${tableName}`);
      }
    });
    console.log(`\n   Total: ${tableLines.length} tables\n`);

    // Get row counts
    console.log('📊 Row counts:');
    for (const line of tableLines) {
      const tableName = line.split('|')[1]?.trim();
      if (tableName) {
        try {
          const countCommand = `psql -h "${DB_HOST}" -p ${DB_PORT} -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT COUNT(*) FROM ${tableName};" -t`;
          const count = execSync(countCommand, { encoding: 'utf-8' }).trim();
          console.log(`   ${tableName}: ${count} rows`);
        } catch (err) {
          console.log(`   ${tableName}: Error counting`);
        }
      }
    }
  }

  console.log('\n✅ Connection test completed successfully!\n');

} catch (error) {
  console.error('❌ Connection failed!\n');
  console.error('Error:', error.message);
  console.error('');
  console.error('Common issues:');
  console.error('1. PostgreSQL client (psql) not installed');
  console.error('   Install with: brew install postgresql (macOS)');
  console.error('');
  console.error('2. IP address not whitelisted in Azure PostgreSQL firewall');
  console.error('   - Go to Azure Portal → Your PostgreSQL Server');
  console.error('   - Navigate to "Connection security"');
  console.error('   - Add your IP address to firewall rules');
  console.error('   - Ensure "Allow access to Azure services" is ON');
  console.error('');
  console.error('3. Incorrect password or username');
  console.error('4. Network connectivity problems');
  console.error('');
  process.exit(1);
} finally {
  // Clean up
  delete process.env.PGPASSWORD;
}
