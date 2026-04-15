/**
 * MIDDLEWARE: Rate Limiter Personalizado
 * Basado en el principio de seguridad 'Disponibilidad'.
 * Previene el abuso del endpoint de contacto sin depender de bases de datos externas (en memoria).
 */

// Mapa en memoria para rastrear IPs (Para producción, se recomendaría Redis)
const ipCache = new Map();

// Configuración: 5 peticiones cada 15 minutos por IP
const WINDOW_TIME = 15 * 60 * 1000; 
const MAX_LIMIT = 5;

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();

  if (!ipCache.has(ip)) {
    ipCache.set(ip, { count: 1, startTime: now });
    return next();
  }

  const userData = ipCache.get(ip);
  const diff = now - userData.startTime;

  if (diff > WINDOW_TIME) {
    // La ventana ha expirado, reiniciamos el contador
    ipCache.set(ip, { count: 1, startTime: now });
    return next();
  }

  if (userData.count >= MAX_LIMIT) {
    // SEGURIDAD: No revelamos demasiada información, solo que ha excedido el límite
    console.warn(`[SECURITY ALERT] Rate limit exceeded for IP: ${ip.replace(/\d/g, '*')}`); // IP ofuscada en logs
    return res.status(429).json({
      success: false,
      message: 'Demasiadas peticiones. Por favor, inténtelo de nuevo más tarde.'
    });
  }

  // Incrementar contador
  userData.count++;
  next();
};

// Limpieza periódica de la caché para evitar fugas de memoria (Memory Leaks)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipCache.entries()) {
    if (now - data.startTime > WINDOW_TIME) {
      ipCache.delete(ip);
    }
  }
}, WINDOW_TIME);

module.exports = rateLimiter;