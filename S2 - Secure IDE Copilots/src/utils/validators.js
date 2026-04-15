const { validationResult } = require('express-validator');

/**
 * Encapsula la lógica de validación para mantener el controlador limpio.
 * @throws {Error} Si la validación falla, lanza un error con los detalles.
 */
const validateRequest = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation Failed');
    error.details = errors.array().map(e => ({ field: e.path, message: e.msg }));
    error.statusCode = 400;
    throw error;
  }
};

module.exports = { validateRequest };