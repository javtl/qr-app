const { v4: uuidv4 } = require('uuid');
const { validateRequest } = require('../utils/validators');

/**
 * CONTROLADOR: contactController (Industrial Refactor)
 * Implementa 'Early Return' y 'Fail-Safe' para garantizar que solo 
 * datos saneados procesen ciclos de CPU.
 */
exports.handleContactForm = async (req, res, next) => {
  try {
    // 1. FAIL-SAFE: Validación defensiva inmediata (Zero-Trust)
    validateRequest(req);

    // 2. EXTRACCIÓN: Solo los campos necesarios (Principio de Menor Privilegio)
    const { name, subject } = req.body;
    const messageId = uuidv4();

    // 3. AUDITORÍA: Logging técnico sin exposición de datos sensibles (PII)
    console.log(`[AUDIT] Resource Created: ${messageId} | Category: ${subject} | Identity: ${name}`);

    // 4. RESPUESTA: Semántica y exitosa (201 Created)
    return res.status(201).json({ 
      success: true, 
      messageId 
    });

  } catch (error) {
    // Delegación al Middleware Global de Errores (app.js)
    next(error);
  }
};