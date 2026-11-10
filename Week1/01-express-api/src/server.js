const app = require('./app');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`[Express API] Server is running on http://${HOST}:${PORT}`);
  console.log(`[Express API] Root endpoint: http://localhost:${PORT}/`);
  console.log(`[Express API] Users endpoint: http://localhost:${PORT}/users`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Express API] SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('[Express API] HTTP server closed');
  });
});

