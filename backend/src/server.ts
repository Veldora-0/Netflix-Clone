import { app } from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 NEONFLIX API Server Running Successfully`);
  console.log(`📡 Port:        ${env.PORT}`);
  console.log(`🌐 Base URL:    http://localhost:${env.PORT}/api/v1`);
  console.log(`🩺 Healthcheck: http://localhost:${env.PORT}/api/v1/health`);
  console.log(`🔒 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 Allowed CORS: ${env.CORS_ORIGIN}`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
const shutdown = (signal: string) => {
  console.log(`\nReceived ${signal}. Shutting down NEONFLIX server gracefully...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown if hung
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 5000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default server;
