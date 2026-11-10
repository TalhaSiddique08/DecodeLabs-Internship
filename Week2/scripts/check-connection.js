require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkConnection() {
  console.log('\n--- Checking Supabase PostgreSQL Connection ---');

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.includes('[YOUR-PASSWORD]')) {
    console.error('❌ Error: DATABASE_URL is not configured properly in .env.');
    console.error('   Please replace [YOUR-PASSWORD] with your actual Supabase database password.\n');
    process.exit(1);
  }

  try {
    // 1. Test basic connection
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('✅ Connection established successfully!');

    // 2. Query PostgreSQL version
    const versionResult = await prisma.$queryRawUnsafe('SELECT version();');
    console.log('✅ PostgreSQL Version:', versionResult[0].version.split(',')[0]);

    // 3. Check if 'users' table exists
    const tableResult = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users';
    `);

    if (tableResult.length > 0) {
      console.log('✅ Table "users" exists in the database.');

      // 4. Count current user records
      const count = await prisma.user.count();
      console.log(`ℹ️  Current records in "users" table: ${count}`);

      // 5. Check constraints
      const constraints = await prisma.$queryRawUnsafe(`
        SELECT conname, contype 
        FROM pg_constraint 
        WHERE conrelid = 'users'::regclass;
      `);
      console.log('✅ Active Table Constraints:');
      constraints.forEach((c) => {
        const typeMap = { p: 'PRIMARY KEY', u: 'UNIQUE', c: 'CHECK', f: 'FOREIGN KEY' };
        console.log(`   - ${c.conname} (${typeMap[c.contype] || c.contype})`);
      });
    } else {
      console.log('⚠️  Table "users" does not exist yet.');
      console.log('   Run: npm run prisma:push');
    }

    console.log('\n--- All Connection Checks Passed ---\n');
  } catch (err) {
    console.error('\n❌ Connection Failed:');
    if (err.message.includes('password authentication failed')) {
      console.error('   Database password was incorrect. Please verify your password in .env.');
    } else if (err.message.includes("Can't reach database server") || err.message.includes('ENOTFOUND') || err.message.includes('ETIMEDOUT')) {
      console.error('   Could not reach the database host.');
      console.error('   👉 Reason: Supabase direct connection (`db.<project-ref>.supabase.co:5432`) is IPv6-only.');
      console.error('      If your network or ISP is IPv4-only, it cannot route to Supabase directly.');
      console.error('   👉 Fix: Use the Supabase Connection Pooler URI (which supports IPv4):');
      console.error('      1. Go to Supabase Dashboard -> Project Settings -> Database');
      console.error('      2. Scroll down to "Connection Pooling" or "Connection string"');
      console.error('      3. Select "Session" mode (Port 5432) or "Transaction" mode (Port 6543)');
      console.error('      4. Copy the connection string and paste it into .env');
    } else {
      console.error('   ' + err.message);
    }
    console.log('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
