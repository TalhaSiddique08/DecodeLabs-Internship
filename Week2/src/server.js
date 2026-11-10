require('dotenv').config();
const app = require('./app');
const prisma = require('./config/prisma');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(`  DecodeLabs Week 2: CRUD API Server     `);
  console.log(`  Listening on: http://localhost:${PORT} `);
  console.log(`=========================================`);

  try {
    await prisma.$connect();
    console.log('✓ Connected to Supabase PostgreSQL database via Prisma.');
  } catch (error) {
    console.error('⚠ Warning: Could not connect to database on startup.');
    console.error('  Please verify your DATABASE_URL in .env');
    console.error(`  Details: ${error.message}`);
  }
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('✓ Closed database connections.');
    } catch (err) {
      console.error('Error disconnecting Prisma:', err.message);
    }
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

module.exports = server;

