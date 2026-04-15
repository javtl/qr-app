/**
 * server.js - Entry Point del Taller Sesión 2
 * Responsable de la inicialización del servicio y manejo de procesos.
 */
require('dotenv').config();
const app = require('./src/app');

// Definición de puerto con fallback (Seguridad: Configurable por entorno)
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('-------------------------------------------------------');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`🛡️  Security Status: Zero-Trust Policy Active`);
  console.log(`📂 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('-------------------------------------------------------');
});

/**
 * MANEJO DE SEÑALES DE CIERRE (Graceful Shutdown)
 * Un Senior Engineer asegura que el servidor cierre conexiones 
 * correctamente antes de morir para no dejar peticiones colgadas.
 */
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error(`[CRITICAL] Unhandled Promise Rejection: ${err.message}`);
  // En producción, aquí se enviaría una alerta a un sistema de monitoreo
});

module.exports = server; // Exportamos para las pruebas de Chai-HTTP