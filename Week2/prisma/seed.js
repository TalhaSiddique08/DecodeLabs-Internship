require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial users into Supabase PostgreSQL...');

  const sampleUsers = [
    {
      email: 'alice@example.com',
      age: 25,
      is_active: true
    },
    {
      email: 'bob@example.com',
      age: 30,
      is_active: true
    },
    {
      email: 'charlie@example.com',
      age: 22,
      is_active: false
    }
  ];

  for (const user of sampleUsers) {
    const upserted = await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user
    });
    console.log(`✓ Seeded user: ${upserted.email} (ID: ${upserted.id})`);
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

