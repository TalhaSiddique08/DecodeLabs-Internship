require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to Supabase PostgreSQL database...');
  try {
    await prisma.$connect();
    console.log('✓ Successfully connected to PostgreSQL database.');

    console.log('Applying database constraints (age >= 0)...');
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 FROM information_schema.tables WHERE table_name = 'users'
        ) THEN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'users_age_check'
          ) THEN
            ALTER TABLE users ADD CONSTRAINT users_age_check CHECK (age >= 0);
          END IF;
        END IF;
      END $$;
    `);
    console.log('✓ Database constraints verified successfully.');
  } catch (error) {
    console.error('Error during database setup:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

