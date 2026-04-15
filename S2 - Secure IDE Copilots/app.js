/**
 * app.js - Configuración Central de Express (Versión Refactorizada)
 * Orquestación de seguridad, rutas y manejo de errores industrial.
 */
const express = require('express');
const path = require('path');
const contactRoutes = require('./routes/contactRoutes');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// 1. MIDDLEWARES DE PARSEO (Prevención de ataques DoS por carga de datos)
app.use(express.json({ limit: '10kb' })); 
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// 2. SEGURIDAD: RATE LIMITING (Control de tráfico)
app.use('/api', rateLimiter);

// 3. ARCHIVOS ESTÁTICOS (Soberanía de datos local)
app.use(express.static(path.join(__dirname, '../public')));

/**
 * 4. RUTAS DE LA API
 */
app.use('/api', contactRoutes);

/**
 * 5. MANEJO DE RUTAS NO ENCONTRADAS (404)
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso no encontrado'
  });
});

/**
 * 6. MANEJO DE ERRORES CENTRALIZADO (Arquitectura Industrial)
 * Este middleware captura los errores lanzados con next(error) desde los controladores.
 */
app.use((err, req, res, next) => {
  // Determinamos el código de estado (por defecto 500 para errores de sistema)
  const statusCode = err.statusCode || 500;

  // Logging técnico para auditoría (Privacidad: No incluimos req.body en logs)
  console.error(`[SYSTEM ERROR] Status: ${statusCode} | Message: ${err.message}`);
  if (statusCode === 500) console.error(err.stack);

  // Respuesta unificada que mantiene compatibilidad con tests y frontend
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Error interno del servidor' : err.message,
    // Si el error contiene detalles de validación (statusCode 400), los incluimos
    errors: err.details || undefined
  });
});

module.exports = app;