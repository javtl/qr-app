/**
 * form-handler.js - Versión de Grado Industrial
 * Implementa validación pre-vuelo y manejo de errores semánticos.
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const statusMsg = document.getElementById('statusMsg');

  /**
   * Renderiza el estado de la petición en la UI
   */
  const displayStatus = (text, isError = false) => {
    statusMsg.textContent = text;
    statusMsg.style.display = 'block';
    statusMsg.style.color = isError ? '#dc2626' : '#059669';
    statusMsg.style.backgroundColor = isError ? '#fee2e2' : '#f0fdf4';
    statusMsg.style.padding = '10px';
    statusMsg.style.borderRadius = '4px';
    statusMsg.style.marginTop = '10px';
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. VALIDACIÓN PRE-VUELO (Client-side early return)
    if (!contactForm.checkValidity()) {
      displayStatus("Por favor, revisa los campos marcados en rojo.", true);
      return;
    }

    // 2. UI STATE: Bloqueo de concurrencia
    submitBtn.disabled = true;
    submitBtn.textContent = 'Procesando...';
    statusMsg.style.display = 'none';

    // 3. RECOLECCIÓN Y SANEAMIENTO BÁSICO
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value.trim()
    };

    try {
      // 4. PETICIÓN ASÍNCRONA
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        // ÉXITO (201 Created)
        displayStatus(`Éxito: Tu mensaje ha sido registrado con ID ${result.messageId}`);
        contactForm.reset();
        if (typeof charCount !== 'undefined') charCount.textContent = "0 / 1000";
      } else {
        // FALLO SEMÁNTICO (400, 429, 500)
        // Mapeamos el array de errores detallados que envía nuestro middleware industrial
        const errorMessage = result.errors 
          ? `Error: ${result.errors.map(err => err.message).join(' | ')}`
          : result.message || 'Error en el servidor';
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      displayStatus(error.message, true);
    } finally {
      // 5. RESTAURACIÓN DE ESTADO
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensaje';
    }
  });
});