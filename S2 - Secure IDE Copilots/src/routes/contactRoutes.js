const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { body } = require('express-validator');

/**
 * ESQUEMA DE VALIDACIÓN INDUSTRIAL (Zero-Trust & Fail-Safe)
 * Actúa como el primer perímetro de seguridad antes de tocar la CPU.
 */
const contactValidationRules = [
  // Nombre: String, min 3, max 50, solo letras y espacios (RFC-compliant)
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('El nombre debe tener entre 3 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/)
    .withMessage('El nombre solo puede contener letras y espacios')
    .escape(), // Bloqueo de XSS

  // Email: Formato RFC 5322 estricto
  body('email')
    .isEmail()
    .withMessage('Formato de email inválido (RFC 5322 requerido)')
    .normalizeEmail(),

  // Asunto: Enum exacto ['Support', 'Sales', 'Other']
  body('subject')
    .isIn(['Support', 'Sales', 'Other'])
    .withMessage('El asunto debe ser Support, Sales u Other'),

  // Mensaje: String, max 1000 caracteres, saneado
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('El mensaje no puede superar los 1000 caracteres')
    .escape() // Neutraliza inyecciones HTML/Scripts
];

/**
 * @route   POST /contact
 * @desc    Recibe y valida el formulario de contacto con Early Return
 */
router.post(
  '/contact', 
  contactValidationRules, 
  contactController.handleContactForm 
);

module.exports = router;